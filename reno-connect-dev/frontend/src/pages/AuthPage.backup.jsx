import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AuthPage.module.css';
import { api } from '../services/api';

const roles = ['Customer', 'Service Provider'];
const services = ['Gardening', 'Plumbing', 'Electrical', 'Painting'];

const AuthPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [login, setLogin] = useState({ email: '', password: '', remember: false });
  const [signup, setSignup] = useState({ 
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: '', 
    services: [], 
    availability: '',
    address: '',
    phoneNumber: ''
  });
  const [touched, setTouched] = useState({});
  const [error, setError] = useState('');

  const handleLoginChange = e => {
    const { name, value, type, checked } = e.target;
    setLogin(l => ({ ...l, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSignupChange = e => {
    const { name, value, type, checked } = e.target;
    if (name === 'services') {
      setSignup(s => ({ ...s, services: checked ? [...s.services, value] : s.services.filter(v => v !== value) }));
    } else {
      setSignup(s => ({ ...s, [name]: value }));
    }
  };

  const handleBlur = e => setTouched(t => ({ ...t, [e.target.name]: true }));

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await api.login(login);
      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const userData = {
        firstName: signup.firstName,
        lastName: signup.lastName,
        email: signup.email,
        password: signup.password,
        address: signup.address,
        phoneNumber: signup.phoneNumber
      };
      
      const response = await api.register(userData);
      if (response.token) {
        localStorage.setItem('token', response.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const showServices = signup.role === 'Service Provider';
  const showCustomerFields = signup.role === 'Customer';

  return (
    <div className={styles.authPage}>
      <div className={styles.leftPanel}>
        <h1>Welcome to RenoConnect</h1>
        <p>Your trusted platform for home services</p>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.tabs}>
          <button className={tab === 'login' ? styles.active : ''} onClick={() => setTab('login')}>Login</button>
          <button className={tab === 'signup' ? styles.active : ''} onClick={() => setTab('signup')}>Sign Up</button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {tab === 'login' ? (
          <form className={styles.form} onSubmit={handleLoginSubmit} autoComplete="off">
            <label>Email
              <input name="email" type="email" value={login.email} onChange={handleLoginChange} onBlur={handleBlur} required />
            </label>
            <label>Password
              <input name="password" type="password" value={login.password} onChange={handleLoginChange} onBlur={handleBlur} required />
            </label>
            <div className={styles.row}>
              <label className={styles.checkbox}><input type="checkbox" name="remember" checked={login.remember} onChange={handleLoginChange} /> Remember me</label>
            </div>
            <button className={styles.primaryBtn} type="submit">Sign In</button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleSignupSubmit} autoComplete="off">
            <label>First Name
              <input name="firstName" value={signup.firstName} onChange={handleSignupChange} onBlur={handleBlur} required />
            </label>
            <label>Last Name
              <input name="lastName" value={signup.lastName} onChange={handleSignupChange} onBlur={handleBlur} required />
            </label>
            <label>Email
              <input name="email" type="email" value={signup.email} onChange={handleSignupChange} onBlur={handleBlur} required />
            </label>
            <label>Password
              <input name="password" type="password" value={signup.password} onChange={handleSignupChange} onBlur={handleBlur} required />
            </label>
            <label>Role
              <select name="role" value={signup.role} onChange={handleSignupChange} onBlur={handleBlur} required>
                <option value="">Select role</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </label>
            {showCustomerFields && (
              <>
                <label>Address
                  <input
                    name="address" 
                    type="text"
                    value={signup.address} 
                    onChange={handleSignupChange} 
                    onBlur={handleBlur} 
                    placeholder="Enter your address"
                    required
                  />
                </label>
                <label>Phone Number
                  <input
                    name="phoneNumber" 
                    type="tel" 
                    value={signup.phoneNumber} 
                    onChange={handleSignupChange} 
                    onBlur={handleBlur} 
                    placeholder="Enter your phone number"
                    required
                  />
                </label>
              </>
            )}
            {showServices && (
              <>
                <div className={styles.servicesChips}>
                  {services.map(s => (
                    <label key={s} className={styles.chip}>
                      <input
                        type="checkbox"
                        name="services"
                        value={s}
                        checked={signup.services.includes(s)}
                        onChange={handleSignupChange}
                      />
                      {s}
                    </label>
                  ))}
                </div>
                <label>Availability
                  <input type="date" name="availability" value={signup.availability} onChange={handleSignupChange} />
                </label>
              </>
            )}
            <button className={styles.primaryBtn} type="submit">Sign Up</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthPage; 