import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import EditUserModal from './EditUserModal';

const AdminUserList = ({ users, onDeleteUser, onEditUser }) => {
    const [selectedUser, setSelectedUser] = useState(null);

    if (!users || users.length === 0) {
        return <p>No users found.</p>;
    }

    const handleEdit = (user) => {
        setSelectedUser(user);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    const handleSave = (userId, formData) => {
        onEditUser(userId, formData);
        setSelectedUser(null);
    };

    return (
        <>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Name / Business Name</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.email}</td>
                                <td>
                                    <span className={`badge ${user.userType === 'HOMEOWNER' ? 'bg-info' : 'bg-success'}`}>
                                        {user.userType}
                                    </span>
                                </td>
                                <td>{user.userType === 'HOMEOWNER' ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : user.businessName || 'N/A'}</td>
                                <td>{user.phoneNumber || 'N/A'}</td>
                                <td>{user.address || 'N/A'}</td>
                                <td>
                                    {user.userType === 'PROVIDER' && (
                                        <div className="d-flex align-items-center">
                                            {user.averageRating ? (
                                                <>
                                                    <div className="me-2">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar
                                                                key={i}
                                                                color={i < Math.round(user.averageRating) ? '#ffd166' : '#ddd'}
                                                                size={14}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span>({user.averageRating.toFixed(1)})</span>
                                                </>
                                            ) : (
                                                <span>No ratings</span>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td>
                                    <button 
                                        onClick={() => handleEdit(user)} 
                                        className="btn btn-sm btn-outline-primary me-2"
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        onClick={() => onDeleteUser(user.id)} 
                                        className="btn btn-sm btn-outline-danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedUser && (
                <EditUserModal
                    user={selectedUser}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
        </>
    );
};

export default AdminUserList; 