import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { api } from '../services/api';

const roles = ['Customer', 'Service Provider'];
const services = ['Gardening', 'Plumbing', 'Electrical', 'Painting'];

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'HOMEOWNER',
    phoneNumber: '',
    address: '',
    businessName: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    try {
      if (isLogin) {
        const response = await api.login({ email: formData.email, password: formData.password });
        if (response.token) {
          // Extract role from JWT token
          const tokenPayload = JSON.parse(atob(response.token.split('.')[1]));
          const role = tokenPayload.role;
          
          // Store token and user data
          localStorage.setItem('token', response.token);
          localStorage.setItem('userRole', role);
          localStorage.setItem('user', JSON.stringify({
            email: formData.email,
            role: role
          }));
          
          // Navigate based on role
          if (role === 'HOMEOWNER') {
            navigate('/dashboard');
          } else if (role === 'PROVIDER') {
            navigate('/provider-dashboard');
          } else if (role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            throw new Error('Invalid user role');
          }
        }
      } else {
        // Prepare registration data based on role
        const registrationData = {
          ...formData,
          // For service providers, use businessName instead of firstName/lastName
          ...(formData.role === 'PROVIDER' && {
            firstName: formData.businessName,
            lastName: '',
            businessName: formData.businessName
          })
        };
        
        let response;
        if (formData.role === 'HOMEOWNER') {
          response = await api.registerHomeOwner(registrationData);
        } else if (formData.role === 'PROVIDER') {
          response = await api.registerServiceProvider(registrationData);
        } else {
          throw new Error('Invalid role selected');
        }

        if (response.data.token) {
          // Extract role from JWT token
          const tokenPayload = JSON.parse(atob(response.data.token.split('.')[1]));
          const role = tokenPayload.role;
          
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userRole', role);
          
          // Navigate based on role
          if (role === 'HOMEOWNER') {
            navigate('/dashboard');
          } else if (role === 'PROVIDER') {
            navigate('/provider-dashboard');
          } else if (role === 'ADMIN') {
            navigate('/admin/dashboard');
          } else {
            throw new Error('Invalid user role');
          }
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Authentication failed';
      setError(errorMessage);
    }
  };

  const toggleMode = () => {
    console.log('Toggling mode from', isLogin, 'to', !isLogin);
    setIsLogin(!isLogin);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: 'HOMEOWNER',
      phoneNumber: '',
      address: '',
      businessName: ''
    });
    setError('');
  };

  const showServices = formData.role === 'Service Provider';
  const showCustomerFields = formData.role === 'Customer';

  return (
    <div className={styles.authPage}>
      <div className={styles.leftPanel}>
        <h1>Welcome to RenoConnect</h1>
        <p>Your Nest Our Best</p>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.authBox}>
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          {error && <div className={styles.error}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <div className={styles.formGroup}>
                <label>Role</label>
                <select 
                  name="role" 
                  value={formData.role} 
                  onChange={handleChange}
                  required
                >
                  <option value="HOMEOWNER">Home Owner</option>
                  <option value="PROVIDER">Service Provider</option>
                </select>
              </div>
            )}

            {!isLogin && formData.role === 'HOMEOWNER' && (
              <>
                <div className={styles.formGroup}>
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your address"
                    required
                  />
                </div>
              </>
            )}

            {!isLogin && formData.role === 'PROVIDER' && (
              <div className={styles.formGroup}>
                <label>Business Name</label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  placeholder="Enter your business name"
                  required
                />
              </div>
            )}

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className={styles.primaryBtn}>
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <p className={styles.switchText}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button"
              onClick={toggleMode}
              className={styles.switchBtn}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 