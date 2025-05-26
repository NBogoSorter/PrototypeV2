import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navigation.module.css';
import { api } from '../services/api';

const Navigation = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  const handleLogout = () => {
    api.logout();
    navigate('/');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <Link to="/">RenoConnect</Link>
      </div>
      
      <div className={styles.links}>
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        
        {token ? (
          <>
            {userRole === 'HOMEOWNER' ? (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/search">Search Services</Link>
              </>
            ) : userRole === 'PROVIDER' ? (
              <>
                <Link to="/provider-dashboard">Dashboard</Link>
                <Link to="/services/manage">Manage Services</Link>
              </>
            ) : userRole === 'ADMIN' ? (
              <Link to="/admin/dashboard">Admin Dashboard</Link>
            ) : null}
            {userRole !== 'ADMIN' && (
              <Link to="/chat">Messages</Link>
            )}
            <button onClick={handleLogout} className={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <Link to="/auth">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navigation; 