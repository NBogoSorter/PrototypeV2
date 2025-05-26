import React from 'react';
import styles from './ServicesHowItWorks.module.css';

const services = [
  { name: 'Gardening', icon: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#FCD361"/><path d="M20 28c-4-2-8-7-8-11a8 8 0 0116 0c0 4-4 9-8 11z" fill="#2F3B52"/></svg>
  ) },
  { name: 'Plumbing', icon: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#FCD361"/><path d="M28 18v-2a2 2 0 00-2-2h-2V8h-8v6h-2a2 2 0 00-2 2v2h4v-2h8v2h4z" fill="#2F3B52"/></svg>
  ) },
  { name: 'Electrical', icon: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#FCD361"/><path d="M18 28l4-8h-4l4-8" stroke="#2F3B52" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ) },
  { name: 'Painting', icon: (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="20" fill="#FCD361"/><rect x="14" y="18" width="12" height="8" rx="2" fill="#2F3B52"/><rect x="17" y="12" width="6" height="8" rx="2" fill="#2F3B52"/></svg>
  ) },
];

const steps = [
  { icon: '🔍', title: 'Search trusted pros', caption: 'Find top-rated professionals near you.' },
  { icon: '⚡', title: 'Book instantly online', caption: 'Schedule your service in just a few clicks.' },
  { icon: '✅', title: 'Get the job done & review', caption: 'Relax while the pro works, then leave feedback.' },
];

const ServicesHowItWorks = () => (
  <div className={styles.wrapper}>
    <section className={styles.servicesSection}>
      <h2 className={styles.sectionTitle}>Our Services</h2>
      <div className={styles.servicesGrid}>
        {services.map((s, i) => (
          <div className={styles.serviceCard} key={s.name}>
            <div className={styles.serviceIcon}>{s.icon}</div>
            <div className={styles.serviceName}>{s.name}</div>
          </div>
        ))}
      </div>
    </section>
    <section className={styles.howSection}>
      <h2 className={styles.sectionTitle}>How It Works</h2>
      <div className={styles.stepsRow}>
        {steps.map((step, i) => (
          <React.Fragment key={step.title}>
            <div className={styles.stepCard}>
              <div className={styles.stepIcon}>{step.icon}</div>
              <div className={styles.stepTitle}>{step.title}</div>
              <div className={styles.stepCaption}>{step.caption}</div>
            </div>
            {i < steps.length - 1 && <div className={styles.arrow} />}
          </React.Fragment>
        ))}
      </div>
    </section>
  </div>
);

export default ServicesHowItWorks; 