//Starter example Front end for Home Owner account creator
//Proper front end is in seperate repository


import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import styles from './HomeOwnManage.module.css';

const HomeOwnManage = () => {
  const [owners, setOwners] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    phoneNumber: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHomeOwners();
  }, []);

  const loadHomeOwners = async () => {
    try {
      const data = await api.getAllHomeOwners();
      setHomeOwners(data);
    } catch (error) {
      console.error('Error loading home owners:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateUserProfile(editingId, formData);
      } else {
        await api.createHomeOwner(formData);
      }
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        address: '',
        phoneNumber: ''
      });
      setEditingId(null);
      loadOwners();
    } catch (err) {
      setError('Failed to save home owner');
    }
  };

  const handleEdit = (owner) => {
    setFormData({
      firstName: owner.firstName,
      lastName: owner.lastName,
      email: owner.email,
      password: '',
      address: owner.address,
      phoneNumber: owner.phoneNumber
    });
    setEditingId(owner.id);
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteUser(id);
      loadOwners();
    } catch (err) {
      setError('Failed to delete home owner');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Manage Home Owners</h2>
      {error && <div className={styles.error}>{error}</div>}
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
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
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
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
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required={!editingId}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Address</label>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitBtn}>
          {editingId ? 'Update' : 'Add'} Home Owner
        </button>
      </form>

      <div className={styles.ownersList}>
        {owners.map(owner => (
          <div key={owner.id} className={styles.ownerCard}>
            <h3>{owner.firstName} {owner.lastName}</h3>
            <p>Email: {owner.email}</p>
            <p>Address: {owner.address}</p>
            <p>Phone: {owner.phoneNumber}</p>
            <div className={styles.actions}>
              <button onClick={() => handleEdit(owner)} className={styles.editBtn}>Edit</button>
              <button onClick={() => handleDelete(owner.id)} className={styles.deleteBtn}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeOwnManage; 