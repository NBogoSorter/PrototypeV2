import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import styles from './BookingPage.module.css';



const BookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        // Assuming you have an API endpoint to get service details by ID
        const serviceDetails = await api.getServiceById(serviceId);
        setService(serviceDetails);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load service details.');
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchServiceDetails();
  }, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!bookingDate || !bookingTime) {
      setError('Please select a date and time for the booking.');
      return;
    }

    // The backend combines them into a LocalDateTime object.
    const bookingDateTime = `${bookingDate}T${bookingTime}:00`;

    try {
      // The createBooking function will fetch
      // 1.the homeOwnerId (from token/local storage)
      // 2. the serviceProviderId (from the service object)
      const bookingDetails = {
        serviceId: parseInt(serviceId),
        bookingDate: bookingDateTime,
      };
      
      console.log('Submitting booking details:', bookingDetails);
      await api.createBooking(bookingDetails);
      setSuccessMessage('Booking created successfully! You will be redirected shortly.');
      // Redirects to dashboard after 3 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Failed to create booking. Please try again.');
      console.error('Booking creation error:', err);
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Loading service details...</div>;
  }

  if (error && !service) { // If service details failed to load
    return <div className={styles.error}>{error}</div>;
  }
  
  if (!service) {
    return <div className={styles.error}>Service not found.</div>;
  }

  return (
    <div className={styles.bookingPage}>
      <h2>Book Service: {service?.name}</h2>
      <p>Provider: {service?.providerName}</p>
      <p>Price: ${service?.price} total</p>
      <form onSubmit={handleSubmit} className={styles.bookingForm}>
        <div className={styles.formGroup}>
          <label htmlFor="bookingDate">Date:</label>
          <input
            type="date"
            id="bookingDate"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            required
            min={new Date().toISOString().split('T')[0]} // Prevent past dates from being selected
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="bookingTime">Time:</label>
          <input
            type="time"
            id="bookingTime"
            value={bookingTime}
            onChange={(e) => setBookingTime(e.target.value)}
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {successMessage && <p className={styles.success}>{successMessage}</p>}
        <button type="submit" className={styles.submitButton}>Confirm Booking</button>
      </form>
    </div>
  );
};

export default BookingPage; 