import React, { useState, useEffect } from 'react';
import styles from './ProviderDashboard.module.css';
import { FaStar, FaCheckCircle, FaTimesCircle, FaUserCircle, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom'; // Navigation


// Mock Payment Modal Component
const MockPaymentModal = ({ isOpen, onClose, onSubmit }) => {
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        expiryDate: '',
        cvc: '',
        nameOnCard: '',
    });

    const handleChange = (e) => {
        setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (cardDetails.cardNumber && cardDetails.expiryDate && cardDetails.cvc && cardDetails.nameOnCard) {
            onSubmit(cardDetails);
        } else {
            alert('Please fill in all card details.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>Sponsorship Subscription</h2>
                <p>Confirm your subscription to sponsor one of your services. This will allow one of your services to be featured more prominently in search results.</p>
                <p><strong>Subscription Cost:</strong> (Mock $10/month)</p>
                <form onSubmit={handleSubmit}>
                    <label>Card Number
                        <input type="text" name="cardNumber" value={cardDetails.cardNumber} onChange={handleChange} placeholder="0000 0000 0000 0000" required />
                    </label>
                    <label>Expiry Date (MM/YY)
                        <input type="text" name="expiryDate" value={cardDetails.expiryDate} onChange={handleChange} placeholder="MM/YY" required />
                    </label>
                    <label>CVC
                        <input type="text" name="cvc" value={cardDetails.cvc} onChange={handleChange} placeholder="123" required />
                    </label>
                    <label>Name on Card
                        <input type="text" name="nameOnCard" value={cardDetails.nameOnCard} onChange={handleChange} required />
                    </label>
                    <div className={styles.modalActions}>
                        <button type="submit" className={styles.confirmBtn}>Confirm Subscription</button>
                        <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ProviderDashboard = () => {
  const [tab, setTab] = useState('upcoming');
  const [profile, setProfile] = useState(null); // Initializes with null
  const [bookings, setBookings] = useState([]); // Initializes with empty array
  const [reviews, setReviews] = useState([]);   // Initializes with empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initializes navigate

  // Subscription state
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    subscribed: false,
    subscriptionEndDate: null,
    sponsoredServiceId: null,
  });
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [services, setServices] = useState([]); // Lists services for sponsoring

  const [editMode, setEditMode] = useState(false);
  // Initializes profileForm with empty strings to avoid undefined errors
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    services: [],
    location: '',
    businessName: '', // Added from ServiceProvider model
    phoneNumber: ''   // Added from ServiceProvider model
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetches provider profile
        const providerProfile = await api.getCurrentProviderProfile();
        setProfile(providerProfile);
        setProfileForm({
          name: providerProfile.businessName || '', // Uses businessName for display name by default
          email: providerProfile.email || '',
          services: providerProfile.services ? providerProfile.services.map(s => s.name) : [], // Assuming services is a list of ServiceModel with a 'name' field
          location: providerProfile.address || '', // Uses address as location
          businessName: providerProfile.businessName || '',
          phoneNumber: providerProfile.phoneNumber || ''
        });

        if (providerProfile && providerProfile.id) {
          // Fetches bookings for the provider
          const providerBookings = await api.getProviderBookings();
          setBookings(providerBookings || []);

          // Fetches reviews for the provider
          const providerReviews = await api.getProviderReviews(providerProfile.id);
          setReviews(providerReviews || []);

          // Fetches subscription status
          const subStatus = await api.getSubscriptionStatus();
          setSubscriptionStatus(subStatus);

          // Fetches provider's services to show which one is sponsored or to choose from
          const providerServices = await api.getProviderServices();
          setServices(providerServices || []);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching provider data:", err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once on mount

  // Adds a useEffect to log subscriptionStatus when it changes
  useEffect(() => {
    console.log('Subscription status changed (useEffect):', subscriptionStatus);
  }, [subscriptionStatus]);

  const handleAccept = async (bookingId) => {
    try {
      await api.updateBookingStatus(bookingId, 'CONFIRMED');
      const updatedBookings = bookings.map(b => b.id === bookingId ? { ...b, status: 'CONFIRMED' } : b);
      setBookings(updatedBookings);
      alert('Booking accepted!');
    } catch (err) {
      console.error("Error accepting booking:", err);
      alert('Failed to accept booking.');
    }
  };

  const handleDecline = async (bookingId) => {
    try {
      await api.updateBookingStatus(bookingId, 'CANCELLED');
      const updatedBookings = bookings.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b);
      setBookings(updatedBookings);
      alert('Booking declined!');
    } catch (err) {
      console.error("Error declining booking:", err);
      alert('Failed to decline booking.');
    }
  };

  const handleComplete = async (bookingId) => {
    try {
      await api.updateBookingStatus(bookingId, 'COMPLETED');
      const updatedBookings = bookings.map(b => b.id === bookingId ? { ...b, status: 'COMPLETED' } : b);
      setBookings(updatedBookings);
      alert('Booking marked as completed!');
    } catch (err) {
      console.error("Error completing booking:", err);
      alert('Failed to complete booking.');
    }
  };

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    if (!profile || !profile.id) {
        alert('Cannot save profile: Provider ID is missing.');
        return;
    }
    try {
        const profileToUpdate = {
            
            email: profileForm.email,
            businessName: profileForm.businessName,
            address: profileForm.location, // maps location back to address
            phoneNumber: profileForm.phoneNumber,
            // password field is not on the form
            // By design

            
        };

        const updatedProfile = await api.updateServiceProviderProfile(profile.id, profileToUpdate);
        
        // Updates local state with the response from the server
        setProfile(updatedProfile);
        // Also updates the form state to reflect the saved data, especially if the server modifies/cleans it 
        setProfileForm({
            name: updatedProfile.businessName || '',
            email: updatedProfile.email || '',
            services: updatedProfile.services ? updatedProfile.services.map(s => s.name) : [],
            location: updatedProfile.address || '',
            businessName: updatedProfile.businessName || '',
            phoneNumber: updatedProfile.phoneNumber || ''
        });
        setEditMode(false);
        alert('Profile updated successfully!');
    } catch (err) {
        console.error("Error saving profile:", err);
        alert(err.response?.data?.message || err.message || 'Failed to save profile.');
    }
  };

  const handleSubscribe = async (cardDetails) => {
    try {
        console.log('Current subscription status BEFORE API call:', subscriptionStatus);
        const statusFromApi = await api.subscribeProvider(cardDetails);
        console.log('Status received from API after subscribe:', statusFromApi);
        setSubscriptionStatus(statusFromApi);
        console.log('Attempted to set new subscription status.'); 
        setIsPaymentModalOpen(false);
        alert('Successfully subscribed!');
    } catch (err) {
        console.error("Error subscribing:", err);
        alert(err.response?.data?.message || 'Failed to subscribe.');
        setIsPaymentModalOpen(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (window.confirm('Are you sure you want to unsubscribe? Your sponsored service will no longer be featured.')) {
        try {
            const status = await api.unsubscribeProvider();
            setSubscriptionStatus(status);
            alert('Successfully unsubscribed.');
        } catch (err) {
            console.error("Error unsubscribing:", err);
            alert(err.response?.data?.message || 'Failed to unsubscribe.');
        }
    }
  };
  
  const getServiceName = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };

  if (loading) return <div className={styles.loading}>Loading dashboard...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;
  if (!profile) return <div className={styles.empty}>Provider profile not found.</div>;

  // Filters bookings for display
  const upcomingBookings = bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED');
  const pastBookings = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED');

  return (
    <div className={styles.dashboard}>
      <MockPaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        onSubmit={handleSubscribe}
      />
      <header className={styles.header}>
        <div className={styles.avatar}>
          {profile.avatar ? ( // Avatar TBA/out of scope
            <img src={profile.avatar} alt="avatar" />
          ) : (
            <FaUserCircle size={56} color="#bbb" />
          )}
        </div>
        <div>
          {/* Displays businessName as name */}
          <h1>{profile.businessName}</h1> 
          <div className={styles.email}>{profile.email}</div>
          {/* Services are now fetched and displayed from profileForm or profile state */}
          <div className={styles.services}>{profileForm.services.join(', ')}</div>
        </div>
      </header>
      <div className={styles.tabs}>
        <button className={tab === 'upcoming' ? styles.active : ''} onClick={() => setTab('upcoming')}>Upcoming Bookings ({upcomingBookings.length})</button>
        <button className={tab === 'past' ? styles.active : ''} onClick={() => setTab('past')}>Past Bookings ({pastBookings.length})</button>
        <button className={tab === 'reviews' ? styles.active : ''} onClick={() => setTab('reviews')}>Reviews ({reviews.length})</button>
        <button className={tab === 'profile' ? styles.active : ''} onClick={() => setTab('profile')}>Profile</button>
        <button className={tab === 'subscription' ? styles.active : ''} onClick={() => setTab('subscription')}>Sponsorship <FaCreditCard /></button>
      </div>
      <div className={styles.tabContent}>
        {tab === 'upcoming' && (
          <div>
            {upcomingBookings.length === 0 ? (
              <div className={styles.empty}>No upcoming bookings.</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingBookings.map(b => (
                    <tr key={b.id}>
                      <td>{b.homeOwner?.firstName} {b.homeOwner?.lastName}</td>
                      <td>{b.service?.name}</td>
                      <td>{new Date(b.bookingDate).toLocaleDateString()} {new Date(b.bookingDate).toLocaleTimeString()}</td>
                      <td>
                        {b.status === 'PENDING' ? (
                          <span className={styles.statusPending}><FaCalendarAlt /> Pending</span>
                        ) : (
                          <span className={styles.statusUpcoming}><FaCheckCircle /> Upcoming</span>
                        )}
                      </td>
                      <td>
                        {b.status === 'PENDING' ? (
                          <>
                            <button className={styles.acceptBtn} onClick={() => handleAccept(b.id)}>Accept</button>
                            <button className={styles.declineBtn} onClick={() => handleDecline(b.id)}>Decline</button>
                          </>
                        ) : (
                          <button className={styles.completeBtn} onClick={() => handleComplete(b.id)}>Mark Completed</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {tab === 'past' && (
          <div>
            {pastBookings.length === 0 ? (
              <div className={styles.empty}>No past bookings.</div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pastBookings.map(b => (
                    <tr key={b.id}>
                      <td>{b.homeOwner?.firstName} {b.homeOwner?.lastName}</td>
                      <td>{b.service?.name}</td>
                      <td>{new Date(b.bookingDate).toLocaleDateString()} {new Date(b.bookingDate).toLocaleTimeString()}</td>
                      <td>
                        {b.status === 'COMPLETED' ? <span className={styles.statusCompleted}><FaCheckCircle /> Completed</span> : <span className={styles.statusCancelled}><FaTimesCircle /> Cancelled</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
        {tab === 'reviews' && (
          <div>
            {reviews.length === 0 ? (
              <div className={styles.empty}>No reviews yet.</div>
            ) : (
              <div className={styles.reviewsList}>
                {reviews.map(r => (
                  <div key={r.id} className={styles.reviewCard}>
                    <div className={styles.reviewCustomer}>{r.homeOwner?.firstName} {r.homeOwner?.lastName}</div>
                    <div className={styles.reviewStars}>
                      {[1,2,3,4,5].map(star => (
                        <FaStar key={star} color={star <= r.rating ? '#ffd166' : '#ddd'} />
                      ))}
                      <span className={styles.reviewDate}>{new Date(r.reviewDate || Date.now()).toLocaleDateString()}</span> {/* Assuming review has reviewDate */}
                    </div>
                    <div className={styles.reviewText}>{r.comment}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {tab === 'profile' && (
          <div className={styles.profileSection}>
            {editMode ? (
              <div className={styles.profileForm}>
                <label>Business Name
                  <input name="businessName" value={profileForm.businessName} onChange={handleProfileChange} />
                </label>
                <label>Email
                  <input name="email" value={profileForm.email} onChange={handleProfileChange} type="email" />
                </label>
                <label>Services (comma-separated)
                  {/* Service editing is complex if it involves creating/deleting ServiceModel instances. For now, this is a display or simple text edit. */}
                  <input name="services" value={profileForm.services.join(', ')} 
                         onChange={e => setProfileForm({ ...profileForm, services: e.target.value.split(',').map(s => s.trim()) })} 
                         disabled // Disable for now as direct edit of service names is not robust here
                  />
                </label>
                <label>Location (Address)
                  <input name="location" value={profileForm.location} onChange={handleProfileChange} />
                </label>
                <label>Phone Number
                  <input name="phoneNumber" value={profileForm.phoneNumber} onChange={handleProfileChange} />
                </label>
                <button className={styles.saveBtn} onClick={saveProfile}>Save</button>
                <button className={styles.cancelBtn} onClick={() => {
                    setEditMode(false);
                    // Resets form to current profile state when cancelling
                    setProfileForm({
                        name: profile.businessName || '',
                        email: profile.email || '',
                        services: profile.services ? profile.services.map(s => s.name) : [],
                        location: profile.address || '',
                        businessName: profile.businessName || '',
                        phoneNumber: profile.phoneNumber || ''
                    });
                }}>Cancel</button>
              </div>
            ) : (
              <div className={styles.profileView}>
                <div><strong>Business Name:</strong> {profile.businessName}</div>
                <div><strong>Email:</strong> {profile.email}</div>
                <div><strong>Services:</strong> {profile.services ? profile.services.map(s => s.name).join(', ') : 'N/A'}</div>
                <div><strong>Location:</strong> {profile.address}</div>
                <div><strong>Phone:</strong> {profile.phoneNumber}</div>
                <div><strong>Total Income:</strong> ${profile.totalIncome != null ? profile.totalIncome.toFixed(2) : '0.00'}</div>
                <button className={styles.editBtn} onClick={() => setEditMode(true)}>Edit Profile</button>
              </div>
            )}
          </div>
        )}
        {tab === 'subscription' && (
            <div className={styles.subscriptionSection}>
                <h2>Sponsorship Subscription</h2>
                {subscriptionStatus.subscribed ? (
                    <div>
                        <p className={styles.statusActive}>Status: Active</p>
                        <p>Your subscription is active until: {new Date(subscriptionStatus.subscriptionEndDate).toLocaleDateString()}</p>
                        {subscriptionStatus.sponsoredServiceId ? (
                            <p>Currently sponsoring: <strong>{getServiceName(subscriptionStatus.sponsoredServiceId)}</strong></p>
                        ) : (
                            <p>You are not currently sponsoring any service.</p>
                        )}
                        <button onClick={() => navigate('/services/manage')} className={styles.actionButton}>Manage Sponsored Service</button>
                        <button onClick={handleUnsubscribe} className={styles.cancelBtn}>Unsubscribe</button>
                    </div>
                ) : (
                    <div>
                        <p className={styles.statusInactive}>Status: Not Subscribed</p>
                        <p>Subscribe to feature one of your services and increase its visibility!</p>
                        <button onClick={() => setIsPaymentModalOpen(true)} className={styles.subscribeBtn}>Subscribe Now</button>
                    </div>
                )}
                 <p className={styles.subscriptionNote}>
                    Subscribed providers can choose one service to be "sponsored". 
                    Sponsored services get higher visibility in search results. 
                    Manage which service is sponsored from the <a href="/services/manage">Service Management</a> page.
                </p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProviderDashboard; 