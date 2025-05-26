import React from 'react';
import styles from './HomePage.module.css';
import { FaLeaf, FaWrench, FaBolt, FaPaintRoller, FaSearch, FaUserCheck, FaClipboardCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const featuredServices = [
  { icon: <FaLeaf />, title: 'Gardening' },
  { icon: <FaWrench />, title: 'Plumbing' },
  { icon: <FaBolt />, title: 'Electrical' },
  { icon: <FaPaintRoller />, title: 'Painting' },
];

const howItWorks = [
  { icon: <FaSearch />, text: 'Search for trusted pros' },
  { icon: <FaUserCheck />, text: 'Book instantly online' },
  { icon: <FaClipboardCheck />, text: 'Get the job done & review' },
];

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <section className={styles.hero}>
        <div className={styles.overlay} />
        <div className={styles.heroContent}>
          <h1>Welcome to RenoConnect</h1>
          <p>Your Nest Our Best</p>
        </div>
      </section>
      <section className={styles.howItWorks} id="how">
        <div className={styles.howGrid}>
          {howItWorks.map((step, i) => (
            <div key={i} className={styles.howCol}>
              <div className={styles.howIcon}>{step.icon}</div>
              <div>{step.text}</div>
            </div>
          ))}
        </div>
      </section>
      <section className={styles.featuredServices} id="services">
        <h2>Featured Services</h2>
        <div className={styles.servicesGrid}>
          {featuredServices.map((svc, i) => (
            <div key={i} className={styles.serviceCard}>
              <div className={styles.serviceIcon}>{svc.icon}</div>
              <div className={styles.serviceTitle}>{svc.title}</div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link to="/services" className={styles.primaryBtn}>
            View All Services
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 