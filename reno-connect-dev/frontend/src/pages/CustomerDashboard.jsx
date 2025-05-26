import React, { useState, useEffect } from 'react';
import styles from './CustomerDashboard.module.css';
import { FaStar, FaCalendarAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { api } from '../services/api';

const CustomerDashboard = () => {
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [tab, setTab] = useState('upcoming');
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [showReviewForm, setShowReviewForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const userData = await api.getUserProfile();
        setUser(userData);

        const userBookings = await api.getBookings(); 
        setBookings(userBookings || []);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching customer dashboard data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await api.deleteBooking(bookingId);
        setBookings(currentBookings => currentBookings.filter(b => b.id !== bookingId));
        alert('Booking cancelled successfully.');
      } catch (err) {
        console.error("Error cancelling booking:", err);
        alert(err.response?.data?.message || 'Failed to cancel booking.');
      }
    }
  };

  const handleReview = (bookingId, serviceProviderId, serviceId) => {
    setShowReviewForm(bookingId);
    setReviewText('');
    setReviewRating(5);
  };

  const submitReview = async (bookingId) => {
    const bookingForReview = bookings.find(b => b.id === bookingId);
    if (!bookingForReview || !bookingForReview.service || !bookingForReview.service.id) {
        alert('Cannot submit review. Service information is missing from the booking.');
        return;
    }

    try {
      const reviewData = {
        rating: reviewRating,
        comment: reviewText,
        serviceId: bookingForReview.service.id,
      };
      
      await api.createReview(reviewData); 

      setBookings(bookings.map(b => b.id === bookingId ? { ...b, reviewed: true } : b));
      setShowReviewForm(null);
      alert('Review submitted successfully!');
    } catch (err) {
      console.error('Error submitting review:', err);
      alert(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!user && error) {
    return <div className={styles.error}>Error loading user data: {error}</div>;
  }
  if (!user && loading) {
    return <div className={styles.loading}>Loading user profile...</div>;
  }

  const upcomingBookings = bookings.filter(b => b.status === 'PENDING' || b.status === 'CONFIRMED');
  const pastBookings = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED');

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <h1>Welcome, {user?.firstName} {user?.lastName}</h1>
        <div className={styles.email}>{user?.email}</div>
      </header>
      {error && <div className={styles.errorBanner}>{error}</div>}
      <div className={styles.tabs}>
        <button className={tab === 'upcoming' ? styles.active : ''} onClick={() => setTab('upcoming')}>Upcoming Bookings</button>
        <button className={tab === 'past' ? styles.active : ''} onClick={() => setTab('past')}>Past Bookings</button>
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
                    <th>Provider</th>
                    <th>Service</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingBookings.map(b => (
                    <tr key={b.id}>
                      <td>{b.serviceProvider?.businessName || 'N/A'}</td>
                      <td>{b.service?.name || 'N/A'}</td>
                      <td>{new Date(b.bookingDate).toLocaleString()}</td>
                      <td>
                        {b.status === 'PENDING' && <span className={styles.statusPending}><FaCalendarAlt /> Pending Confirmation</span>}
                        {b.status === 'CONFIRMED' && <span className={styles.statusUpcoming}><FaCheckCircle /> Confirmed</span>}
                      </td>
                      <td><button className={styles.cancelBtn} onClick={() => handleCancelBooking(b.id)}><FaTimesCircle /> Cancel</button></td>
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
                    <th>Provider</th>
                    <th>Service</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Review</th>
                  </tr>
                </thead>
                <tbody>
                  {pastBookings.map(b => (
                    <tr key={b.id}>
                      <td>{b.serviceProvider?.businessName || 'N/A'}</td>
                      <td>{b.service?.name || 'N/A'}</td>
                      <td>{new Date(b.bookingDate).toLocaleString()}</td>
                      <td>
                        {b.status === 'COMPLETED' && <span className={styles.statusCompleted}><FaCheckCircle /> Completed</span>}
                        {b.status === 'CANCELLED' && <span className={styles.statusCancelled}><FaTimesCircle /> Cancelled</span>}
                      </td>
                      <td>
                        {b.status === 'COMPLETED' && !b.hasUserReviewed && showReviewForm !== b.id && (
                          <button className={styles.reviewBtn} onClick={() => handleReview(b.id)}>Review</button>
                        )}
                        {b.status === 'COMPLETED' && b.hasUserReviewed && (
                          <span className={styles.reviewed}>Reviewed</span>
                        )}
                        {showReviewForm === b.id && (
                          <div className={styles.reviewForm}>
                            <div>
                              {[1,2,3,4,5].map(star => (
                                <FaStar
                                  key={star}
                                  color={star <= reviewRating ? '#ffd166' : '#ddd'}
                                  onClick={() => setReviewRating(star)}
                                  style={{ cursor: 'pointer' }}
                                />
                              ))}
                            </div>
                            <textarea
                              value={reviewText}
                              onChange={e => setReviewText(e.target.value)}
                              rows={2}
                              placeholder="Write your review..."
                            />
                            <button className={styles.submitBtn} onClick={() => submitReview(b.id)}>Submit</button>
                            <button className={styles.cancelReviewBtn} onClick={() => setShowReviewForm(null)}>Cancel</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard; 