import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SearchPage.module.css';
import { FaStar } from 'react-icons/fa';
import { api } from '../services/api';

const serviceTypes = ['GARDENING', 'PLUMBING', 'ELECTRICAL', 'PAINTING'];
const sortOptions = ['Best Match', 'Price: Low to High', 'Price: High to Low', 'Rating'];
const locationOptions = [
  { value: 'NORTH', label: 'North Reno' },
  { value: 'SOUTH', label: 'South Reno' },
  { value: 'WEST', label: 'West Reno' },
  { value: 'EAST', label: 'East Reno' },
  { value: 'MIDTOWN', label: 'Midtown' },
  { value: 'DOWNTOWN', label: 'Downtown' },
  { value: 'SPARKS', label: 'Sparks' }
];

const SearchPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    serviceTypes: [],
    location: '',
    rating: 1,
    sortBy: 'Best Match',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await api.getAllServices();
      console.log('Fetched services for search (raw response):', response);
      setServices(response || []);
      console.log('Services state after fetch:', response || []);
      setError('');
    } catch (err) {
      console.error('Error fetching services for search:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.message || err.message || 'Failed to load services');
      }
    } finally {
        setLoading(false);
    }
  };

  const handleFilterChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === 'serviceTypes') {
      setFilters(f => ({
        ...f,
        serviceTypes: checked ? [...f.serviceTypes, value] : f.serviceTypes.filter(v => v !== value),
      }));
    } else {
      setFilters(f => ({ ...f, [name]: value }));
    }
  };

  const processedServices = useMemo(() => {
    // 1. Apply all filters (type, location, rating) to the initial services list
    const filteredServices = services.filter(service => {
      if (filters.serviceTypes.length && !filters.serviceTypes.includes(service.type)) return false;
      if (filters.location && service.location !== filters.location) return false;
      // Ensure service.averageRating is a number before comparing
      if (filters.rating && (typeof service.averageRating !== 'number' || service.averageRating < parseFloat(filters.rating))) return false;
      return true;
    });
    console.log('Filtered services (passed type, location, rating):', filteredServices);

    // 2. Separate sponsored services that passed filters
    const allSponsoredInFilters = filteredServices.filter(s => s.sponsored);
    console.log('All sponsored services that also passed general filters:', allSponsoredInFilters);
    
    // 3. Randomly select up to 3 sponsored services from this filtered pool
    const randomTopSponsored = [];
    const sponsoredPoolCopy = [...allSponsoredInFilters]; // Create a mutable copy
    const count = Math.min(3, sponsoredPoolCopy.length);
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * sponsoredPoolCopy.length);
        randomTopSponsored.push(sponsoredPoolCopy.splice(randomIndex, 1)[0]);
    }

    // 4. Create the rest of the list: non-sponsored (that passed filters) + sponsored (that passed filters but weren't in top 3)
    // We need to ensure services in randomTopSponsored are not duplicated in the restOfTheList.
    const topSponsoredIds = new Set(randomTopSponsored.map(s => s.id));
    const restOfTheList = filteredServices.filter(s => !topSponsoredIds.has(s.id));

    // 5. Sort ONLY the restOfTheList based on the sortBy filter
    const sortedRestOfTheList = [...restOfTheList].sort((a, b) => {
        switch (filters.sortBy) {
            case 'Price: Low to High':
                return (a.price || 0) - (b.price || 0);
            case 'Price: High to Low':
                return (b.price || 0) - (a.price || 0);
            case 'Rating':
                // Ensure averageRating is treated as a number, defaulting if necessary
                return (b.averageRating || 0) - (a.averageRating || 0);
            case 'Best Match': // Implement logic for Best Match if desired, otherwise it's a no-op for sorting
            default:
                return 0; // Default: no change in order, or could be by ID, name, etc.
        }
    });
    
    // Return an object containing both lists
    return { randomTopSponsored, sortedRestOfTheList };

  }, [services, filters]);

  console.log("Processed services for display:", processedServices);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.searchPage}>
      <aside className={styles.sidebar}>
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>Service Type</div>
          {serviceTypes.map(type => (
            <label key={type} className={styles.checkbox}>
              <input
                type="checkbox"
                name="serviceTypes"
                value={type}
                checked={filters.serviceTypes.includes(type)}
                onChange={handleFilterChange}
              />
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </label>
          ))}
        </div>
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>Location</div>
          <select
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            className={styles.select}
          >
            <option value="">All Locations</option>
            {locationOptions.map(location => (
              <option key={location.value} value={location.value}>
                {location.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>Rating: {filters.rating}+</div>
          <input
            type="range"
            name="rating"
            min={0}
            max={5}
            step={0.1}
            value={filters.rating}
            onChange={handleFilterChange}
          />
        </div>
        <div className={styles.filterGroup}>
          <div className={styles.filterLabel}>Sort By</div>
          <select name="sortBy" value={filters.sortBy} onChange={handleFilterChange} className={styles.select}>
            {sortOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
      </aside>
      <main className={styles.mainContent}>
        {/* Section for Randomly Selected Sponsored Services */}
        {processedServices.randomTopSponsored && processedServices.randomTopSponsored.length > 0 && (
            <div className={styles.sponsoredSection}>
                <h2><FaStar color="#ffd166" /> Featured Services</h2> {/* Changed heading */}
                <div className={styles.grid}>
                    {processedServices.randomTopSponsored.map(service => (
                        <div key={`sponsored-${service.id}`} className={`${styles.card} ${styles.sponsoredHighlightCard}`}>
                             <div className={styles.sponsoredTag}><FaStar size={12} /> SPONSORED</div>
                            <div className={styles.name}>{service.providerName}</div>
                            <div className={styles.serviceName}>{service.name}</div>
                            <div className={styles.stars}>
                                {[...Array(5)].map((_, i) => (
                                <FaStar 
                                    key={i} 
                                    color={i < Math.round(service.averageRating || 0) ? '#ffd166' : '#ddd'} 
                                />
                                ))}
                                <span className={styles.rating}>
                                {(service.averageRating || 0).toFixed(1)}
                                </span>
                            </div>
                            <div className={styles.price}>${(service.price || 0).toFixed(2)}</div>
                            <div className={styles.duration}>Duration: {service.duration} hour(s)</div>
                            <div className={styles.bio}>{service.description}</div>
                            <div className={styles.buttonGroup}>
                                <button className={styles.profileBtn} onClick={() => navigate(`/provider/${service.providerId}`)}>View Profile</button>
                                <button className={styles.bookBtn} onClick={() => navigate(`/booking/${service.id}`)}>Book Now</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Divider if both sections have content */}
        {processedServices.randomTopSponsored && processedServices.randomTopSponsored.length > 0 && 
         processedServices.sortedRestOfTheList && processedServices.sortedRestOfTheList.length > 0 && 
         <hr className={styles.sectionDivider} />}

        {/* Section for the Rest of the Services (Sorted) */}
        <h3>Other Services</h3> {/* Added a heading for clarity */}
        <div className={styles.grid}>
          {processedServices.sortedRestOfTheList && processedServices.sortedRestOfTheList.length > 0 ? (
            processedServices.sortedRestOfTheList.map(service => (
                <div key={service.id} className={`${styles.card} ${service.sponsored ? styles.sponsoredCard : ''}`}>
                 {service.sponsored && <div className={styles.sponsoredTagSmall}><FaStar size={10}/> Sponsored</div>}
                <div className={styles.name}>{service.providerName}</div>
                <div className={styles.serviceName}>{service.name}</div>
                <div className={styles.stars}>
                    {[...Array(5)].map((_, i) => (
                    <FaStar 
                        key={i} 
                        color={i < Math.round(service.averageRating || 0) ? '#ffd166' : '#ddd'} 
                    />
                    ))}
                    <span className={styles.rating}>
                    {(service.averageRating || 0).toFixed(1)}
                    </span>
                </div>
                <div className={styles.price}>${(service.price || 0).toFixed(2)}</div>
                <div className={styles.duration}>Duration: {service.duration} hour(s)</div>
                <div className={styles.bio}>{service.description}</div>
                <div className={styles.buttonGroup}>
                    <button className={styles.profileBtn} onClick={() => navigate(`/provider/${service.providerId}`)}>View Profile</button>
                    <button className={styles.bookBtn} onClick={() => navigate(`/booking/${service.id}`)}>Book Now</button>
                </div>
                </div>
          )) ) : (
            <div className={styles.noResults}>No services match your current filters.</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchPage; 