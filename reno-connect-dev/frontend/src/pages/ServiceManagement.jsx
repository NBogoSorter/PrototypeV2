import React, { useState, useEffect, useCallback } from 'react';
import styles from './ServiceManagement.module.css';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa'; // For sponsored icon

const ServiceManagement = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    type: 'GARDENING', // Changed from category to type to match backend
    price: '',
    location: '', // Added location field
    duration: 1 // Added duration field, default to 1 hour
  });

  // Subscription state
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    subscribed: false,
    subscriptionEndDate: null,
    sponsoredServiceId: null,
  });

  const serviceTypes = [
    { value: 'GARDENING', label: 'Gardening' },
    { value: 'PLUMBING', label: 'Plumbing' },
    { value: 'ELECTRICAL', label: 'Electrical' },
    { value: 'PAINTING', label: 'Painting' }
  ];

  const locationOptions = [
    { value: 'NORTH', label: 'North Reno' },
    { value: 'SOUTH', label: 'South Reno' },
    { value: 'WEST', label: 'West Reno' },
    { value: 'EAST', label: 'East Reno' },
    { value: 'MIDTOWN', label: 'Midtown' },
    { value: 'DOWNTOWN', label: 'Downtown' },
    { value: 'SPARKS', label: 'Sparks' }
  ];

  // Moved loadData outside useEffect and wrapped with useCallback
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [servicesData, subStatusData] = await Promise.all([
        api.getProviderServices(),
        api.getSubscriptionStatus()
      ]);
      console.log('ServiceManagement - subStatusData from API:', subStatusData); // Log API response
      setServices(servicesData || []);
      setSubscriptionStatus(subStatusData || { subscribed: false, sponsoredServiceId: null, subscriptionEndDate: null });
      setError('');
    } catch (err) {
      console.error('Error fetching page data:', err);
      // Preserve navigate for 401 errors if possible or handle differently
      if (err.response?.status === 401) {
        navigate('/auth'); 
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load data.');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    // Check if user is logged in and is a service provider
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (!token) {
      setError('Please log in to access this page');
      navigate('/auth');
      return;
    }
    
    if (userRole !== 'PROVIDER') {
      setError('Only service providers can access this page');
      navigate('/');
      return;
    }

    loadData();
  }, [loadData, navigate]);

  // Add a useEffect to log subscriptionStatus when it changes
  useEffect(() => {
    console.log('ServiceManagement - subscriptionStatus changed (useEffect):', subscriptionStatus);
  }, [subscriptionStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert price and duration to number and ensure they are valid
      const serviceData = {
        ...newService,
        price: parseFloat(newService.price),
        duration: parseInt(newService.duration, 10),
      };

      console.log('Submitting service data:', serviceData); // Debug log
      
      await api.createService(serviceData);
      setShowAddForm(false);
      setNewService({
        name: '',
        description: '',
        price: '',
        type: 'GARDENING',
        location: '',
        duration: 1, // Reset duration
      });
      loadData(); // Refresh all data (services and subscription status)
    } catch (err) {
      console.error('Error creating service:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to create service. Please try again.');
    }
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        // Log the service being deleted
        const serviceToDelete = services.find(s => s.id === serviceId);
        console.log('Attempting to delete service:', {
          id: serviceId,
          service: serviceToDelete,
          currentUserRole: localStorage.getItem('userRole')
        });

        await api.deleteService(serviceId);
        loadData(); // Refresh the list
      } catch (err) {
        console.error('Error deleting service:', {
          error: err,
          serviceId,
          userRole: localStorage.getItem('userRole'),
          token: localStorage.getItem('token') ? 'present' : 'missing'
        });
        if (err.message.includes('Session expired')) {
          setError('Your session has expired. Please log in again.');
          navigate('/auth');
        } else if (err.message.includes('permission')) {
          setError('You do not have permission to delete this service. Please make sure you are logged in as the service provider who created this service.');
        } else {
          setError(err.message || 'Failed to delete service. Please try again.');
        }
      }
    }
  };

  const handleToggleSponsor = async (serviceId, currentlySponsored) => {
    if (!subscriptionStatus.subscribed) {
        alert('You must be subscribed to sponsor a service. Please subscribe from your dashboard.');
        navigate('/provider-dashboard');
        return;
    }

    if (!currentlySponsored && subscriptionStatus.sponsoredServiceId && subscriptionStatus.sponsoredServiceId !== serviceId) {
        const confirmSwitch = window.confirm('This will replace your currently sponsored service. Continue?');
        if (!confirmSwitch) return;
    }

    try {
        if (currentlySponsored) {
            await api.unsponsorService(serviceId);
            alert('Service is no longer sponsored.');
        } else {
            await api.sponsorService(serviceId);
            alert('Service is now sponsored!');
        }
        loadData(); // Refresh services and subscription status
    } catch (err) {
        console.error('Error toggling sponsor status:', err);
        alert(err.response?.data?.message || 'Failed to update sponsorship.');
    }
  };

  const fetchSubscriptionStatus = async () => {
    try {
      const response = await api.getSubscriptionStatus();
      setSubscriptionStatus(response || { subscribed: false, sponsoredServiceId: null });
    } catch (err) {
      console.error('Error fetching subscription status:', err);
      setError('Failed to load subscription status');
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.serviceManagement}>
      <div className={styles.header}>
        <h1>Service Management</h1>
        <button 
          className={styles.addButton}
          onClick={() => setShowAddForm(true)}
        >
          Add New Service
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showAddForm && (
        <div className={styles.formOverlay}>
          <div className={styles.formContainer}>
            <h2>Add New Service</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Service Name</label>
                <input
                  type="text"
                  name="name"
                  value={newService.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea
                  name="description"
                  value={newService.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Service Type</label>
                <select
                  name="type"
                  value={newService.type}
                  onChange={handleInputChange}
                  required
                >
                  {serviceTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Location</label>
                <select
                  name="location"
                  value={newService.location}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a location</option>
                  {locationOptions.map(location => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Total Price ($)</label>
                <input
                  type="number"
                  name="price"
                  value={newService.price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Duration (hours)</label>
                <input
                  type="number"
                  name="duration"
                  value={newService.duration}
                  onChange={handleInputChange}
                  min="1" // Minimum 1 hour as per backend validation
                  required
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" className={styles.submitButton}>
                  Create Service
                </button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.servicesList}>
        {services.length === 0 ? (
          <div className={styles.emptyState}>
            No services added yet. Click "Add New Service" to get started.
          </div>
        ) : (
          services.map(service => (
            <div key={service.id} className={`${styles.serviceCard} ${subscriptionStatus.sponsoredServiceId === service.id ? styles.sponsoredCard : ''}`}>
              <div className={styles.serviceInfo}>
                <h3>
                    {service.name} 
                    {subscriptionStatus.sponsoredServiceId === service.id && <FaStar color="#ffd166" title="Sponsored" className={styles.sponsoredIcon} />}
                </h3>
                <p>{service.description}</p>
                <div className={styles.serviceDetails}>
                  <span>Type: {service.type}</span>
                  <span>Price: ${service.price ? service.price.toFixed(2) : '0.00'}</span>
                  <span>Duration: {service.duration} hour(s)</span>
                  <span>Rating: {service.averageRating ? service.averageRating.toFixed(1) : 'N/A'} <FaStar color="#ffd166" /></span>
                </div>
              </div>
              <div className={styles.serviceActions}>
                {subscriptionStatus.subscribed && (
                    <button 
                        className={subscriptionStatus.sponsoredServiceId === service.id ? styles.unsponsorButton : styles.sponsorButton}
                        onClick={() => handleToggleSponsor(service.id, subscriptionStatus.sponsoredServiceId === service.id)}
                        disabled={!subscriptionStatus.subscribed}
                    >
                        {subscriptionStatus.sponsoredServiceId === service.id ? 'Stop Sponsoring' : 'Sponsor this Service'}
                    </button>
                )}
                <button 
                  className={styles.deleteButton}
                  onClick={() => {
                    console.log('Delete button clicked for service:', service);
                    handleDelete(service.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ServiceManagement; 