import { useState, useEffect } from 'react';
import { FaUser, FaEdit, FaTrash, FaEnvelope, FaPhone, FaCalendar, FaSearch, FaFilter, FaCheck, FaTimes } from 'react-icons/fa';
import { userService } from '../../services/storageService';
import './ManageUsers.css';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const loadUsers = () => {
    const allUsers = userService.getUsers();
    setUsers(allUsers);
    setFilteredUsers(allUsers);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserForm({
      ...userForm,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const allUsers = userService.getUsers();
    
    if (editingUser) {
      // Update user
      const updatedUsers = allUsers.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...userForm }
          : user
      );
      localStorage.setItem('travelEase_users', JSON.stringify(updatedUsers));
      alert('User updated successfully!');
    } else {
      // Add new user
      const newUser = {
        id: allUsers.length + 1,
        ...userForm,
        password: 'password123', // Default password
        preferences: {
          newsletter: true,
          smsNotifications: false,
          language: 'English',
          currency: 'USD'
        },
        createdAt: new Date().toISOString()
      };
      
      const updatedUsers = [...allUsers, newUser];
      localStorage.setItem('travelEase_users', JSON.stringify(updatedUsers));
      alert('User added successfully!');
    }
    
    resetForm();
    loadUsers();
  };

  const resetForm = () => {
    setUserForm({
      name: '',
      email: '',
      phone: '',
      role: 'user'
    });
    setEditingUser(null);
    setShowForm(false);
  };

  const editUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role || 'user'
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteUser = (id) => {
    const currentUser = userService.getCurrentUser();
    if (currentUser && currentUser.id === id) {
      alert('Cannot delete your own account!');
      return;
    }

    if (window.confirm('Are you sure you want to delete this user?')) {
      const allUsers = userService.getUsers();
      const updatedUsers = allUsers.filter(user => user.id !== id);
      localStorage.setItem('travelEase_users', JSON.stringify(updatedUsers));
      loadUsers();
      alert('User deleted successfully!');
    }
  };

  const toggleUserStatus = (id, currentStatus) => {
    const allUsers = userService.getUsers();
    const updatedUsers = allUsers.map(user =>
      user.id === id ? { ...user, active: !currentStatus } : user
    );
    localStorage.setItem('travelEase_users', JSON.stringify(updatedUsers));
    loadUsers();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="manage-users">
      <div className="manage-header">
        <h1><FaUser /> User Management</h1>
        <button 
          className="add-user-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add New User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="search-filter-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-info">
          <FaFilter />
          <span>{filteredUsers.length} users found</span>
        </div>
      </div>

      {/* User Form */}
      {showForm && (
        <div className="user-form-container">
          <div className="form-header">
            <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
            <button className="close-form" onClick={resetForm}>×</button>
          </div>
          
          <form onSubmit={handleSubmit} className="user-form">
            <div className="form-grid">
              <div className="form-group">
                <label><FaUser /> Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={userForm.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter full name"
                />
              </div>

              <div className="form-group">
                <label><FaEnvelope /> Email *</label>
                <input
                  type="email"
                  name="email"
                  value={userForm.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
                <label><FaPhone /> Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={userForm.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  name="role"
                  value={userForm.role}
                  onChange={handleInputChange}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="form-note">
              <p><strong>Note:</strong> New users will be created with default password: <code>password123</code></p>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                {editingUser ? 'Update User' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Contact</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td className="user-id">#{user.id}</td>
                <td className="user-info">
                  <div className="user-avatar">
                    <FaUser />
                  </div>
                  <div className="user-details">
                    <strong>{user.name}</strong>
                    <small>{user.email}</small>
                  </div>
                </td>
                <td className="user-contact">
                  <div className="contact-item">
                    <FaEnvelope />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="contact-item">
                      <FaPhone />
                      <span>{user.phone}</span>
                    </div>
                  )}
                </td>
                <td>
                  <span className={`role-badge ${user.role || 'user'}`}>
                    {user.role || 'user'}
                  </span>
                </td>
                <td>
                  <button 
                    className={`status-toggle ${user.active !== false ? 'active' : 'inactive'}`}
                    onClick={() => toggleUserStatus(user.id, user.active !== false)}
                  >
                    {user.active !== false ? (
                      <>
                        <FaCheck /> Active
                      </>
                    ) : (
                      <>
                        <FaTimes /> Inactive
                      </>
                    )}
                  </button>
                </td>
                <td className="join-date">
                  <FaCalendar />
                  <span>{formatDate(user.createdAt)}</span>
                </td>
                <td className="user-actions">
                  <div className="action-buttons">
                    <button 
                      className="action-btn edit"
                      onClick={() => editUser(user)}
                      title="Edit User"
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => deleteUser(user.id)}
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredUsers.length === 0 && (
          <div className="empty-state">
            <FaUser className="empty-icon" />
            <h3>No users found</h3>
            <p>{searchTerm ? 'Try a different search term' : 'Add your first user to get started'}</p>
            {!searchTerm && (
              <button 
                className="add-first-btn"
                onClick={() => setShowForm(true)}
              >
                + Add First User
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageUsers;