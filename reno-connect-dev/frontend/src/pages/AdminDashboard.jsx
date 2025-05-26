import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminUserList from '../components/AdminUserList';
import CreateAdminForm from '../components/CreateAdminForm';
import { fetchUsers, deleteUser, updateUser, createAdmin } from '../services/api';
import styles from './AdminDashboard.module.css';
import debounce from 'lodash/debounce';
import { FaPlus, FaExclamationCircle } from 'react-icons/fa';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userType, setUserType] = useState('ALL');
    const [email, setEmail] = useState('');
    const [showCreateAdmin, setShowCreateAdmin] = useState(false);
    const navigate = useNavigate();

    const loadUsers = async () => {
        try {
            setLoading(true);
            const data = await fetchUsers(userType, email);
            setUsers(data);
            setError(null);
        } catch (err) {
            setError('Failed to load users. Please try again.');
            console.error('Error loading users:', err);
        } finally {
            setLoading(false);
        }
    };

    //debounce ensures that the for the search bar, the users are not loaded every time the user types
    // Create a debounced version of loadUsers
    const debouncedLoadUsers = useCallback(
        debounce(() => {
            loadUsers();
        }, 500),
        [userType, email]
    );

    useEffect(() => {
        debouncedLoadUsers();
        // Cleanup function to cancel any pending debounced calls
        return () => {
            debouncedLoadUsers.cancel();
        };
    }, [userType, email, debouncedLoadUsers]);

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(userId);
                setUsers(users.filter(user => user.id !== userId));
            } catch (err) {
                setError('Failed to delete user. Please try again.');
                console.error('Error deleting user:', err);
            }
        }
    };

    const handleEditUser = async (userId, formData) => {
        try {
            const updatedUser = await updateUser(userId, formData);
            setUsers(users.map(user => 
                user.id === userId ? { ...user, ...updatedUser } : user
            ));
        } catch (err) {
            setError('Failed to update user. Please try again.');
            console.error('Error updating user:', err);
        }
    };

    const handleCreateAdmin = async (formData) => {
        try {
            const newAdmin = await createAdmin(formData);
            setUsers([...users, newAdmin]);
            setShowCreateAdmin(false);
            setError(null);
        } catch (err) {
            setError('Failed to create admin user. Please try again.');
            console.error('Error creating admin:', err);
        }
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.loadingSpinner} />
            </div>
        );
    }

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <h2>Admin Dashboard</h2>
                <button 
                    className={styles.createButton}
                    onClick={() => setShowCreateAdmin(true)}
                >
                    <FaPlus /> Create New Admin
                </button>
            </div>
            
            {error && (
                <div className={styles.error}>
                    <FaExclamationCircle />
                    {error}
                </div>
            )}

            <div className={styles.filters}>
                <div className={styles.filterRow}>
                    <div className={styles.filterGroup}>
                        <label htmlFor="userType">User Type</label>
                        <select 
                            id="userType"
                            className={styles.select}
                            value={userType}
                            onChange={(e) => setUserType(e.target.value)}
                        >
                            <option value="ALL">All Users</option>
                            <option value="HOMEOWNER">Homeowners</option>
                            <option value="PROVIDER">Service Providers</option>
                        </select>
                    </div>
                    <div className={styles.filterGroup}>
                        <label htmlFor="email">Search by Email</label>
                        <input
                            id="email"
                            type="text"
                            className={styles.input}
                            placeholder="Enter email to search..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <AdminUserList 
                users={users} 
                onDeleteUser={handleDeleteUser}
                onEditUser={handleEditUser}
            />

            {showCreateAdmin && (
                <CreateAdminForm
                    onSubmit={handleCreateAdmin}
                    onCancel={() => setShowCreateAdmin(false)}
                />
            )}
        </div>
    );
};

export default AdminDashboard; 