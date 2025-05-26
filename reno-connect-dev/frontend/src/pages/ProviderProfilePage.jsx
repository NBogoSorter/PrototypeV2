import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProviderProfilePage.module.css';
import { FaStar, FaCheckCircle, FaTag, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEnvelope, FaTools, FaCommentDots } from 'react-icons/fa';
import { api } from '../services/api';

const ProviderProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProviderData = async () => {
      if (!id) {
        setLoading(false);
        setError('Provider ID is missing.');
        return;
      }
      setLoading(true);
      setError('');
      try {
        const providerData = await api.getProviderById(id);
        setProvider(providerData);
        const reviewsData = await api.getProviderReviews(id);
        setReviews(reviewsData || []);
      } catch (err) {
        console.error("Error fetching provider data:", err);
        setError(err.message || 'Failed to load provider profile. Please check console for details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProviderData();
  }, [id]);

  if (loading) {
    return <div className={styles.loadingPage}>Loading provider profile...</div>;
  }

  if (error) {
    return <div className={styles.profilePage}><div className={styles.error}>{error}</div></div>;
  }

  if (!provider) {
    return <div className={styles.profilePage}><div className={styles.notFound}>Provider not found.</div></div>;
  }

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <div className={styles.profilePage}>
      <nav className={styles.breadcrumb}>
        <a href="/">Home</a> / <a href="/search">Search</a> / <span>{provider.businessName}</span>
      </nav>
      <div className={styles.profileHeader}>
        <div className={styles.headerInfo}>
          <h1>{provider.businessName}</h1>
          <div className={styles.ratingRow}>
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} color={i < Math.round(averageRating) ? '#ffd166' : '#ddd'} />
            ))}
            <span className={styles.rating}>{averageRating.toFixed(1)}</span> ({reviews.length} reviews)
          </div>
        </div>
      </div>

      <div className={styles.profileContent}>
        <div className={styles.leftCol}>
          <div className={styles.contactInfo}>
            <h3>Contact Information</h3>
            {provider.address && <p><FaMapMarkerAlt /> {provider.address}</p>}
            {provider.phoneNumber && <p><FaPhone /> {provider.phoneNumber}</p>}
            {provider.email && <p><FaEnvelope /> {provider.email}</p>}
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.servicesSection}>
            <h3><FaTools /> Services Offered</h3>
            {provider.services && provider.services.length > 0 ? (
              <ul className={styles.servicesList}>
                {provider.services.map(service => (
                  <li key={service.id} className={styles.serviceItem}>
                    <h4>{service.name}</h4>
                    <p>{service.description}</p>
                    <p><strong>Type:</strong> {service.type}</p>
                    <p><strong>Price:</strong> ${service.price}</p>
                    <p><strong>Duration:</strong> {service.duration} hour(s)</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No services listed yet.</p>
            )}
          </div>

          <div className={styles.reviewsSection}>
            <h3><FaCommentDots /> Customer Reviews ({reviews.length})</h3>
            {reviews.length > 0 ? (
              reviews.map(review => (
                <div key={review.id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <strong>{review.homeOwner?.firstName || 'Anonymous'}</strong>
                    <div className={styles.reviewStars}>
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} color={i < review.rating ? '#ffd166' : '#ddd'} />
                      ))}
                    </div>
                  </div>
                  <p className={styles.reviewComment}>{review.comment}</p>
                  {review.reviewDate && <p className={styles.reviewDate}>Reviewed on: {new Date(review.reviewDate).toLocaleDateString()}</p>}
                </div>
              ))
            ) : (
              <p>No reviews yet for this provider.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderProfilePage; 