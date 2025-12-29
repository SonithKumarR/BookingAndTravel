import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaHotel, FaMoneyBill, FaCalendarCheck, FaChartLine, FaEdit, FaTrash, FaCog, FaList } from 'react-icons/fa';
import { userService, bookingService } from '../../services/storageService';
import { hotels } from '../../data/hotels';
import './AdminDashboard.css';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalHotels: 0,
    totalBookings: 0,
    revenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin (demo check)
    const currentUser = userService.getCurrentUser();
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    // Load all data
    const allUsers = userService.getUsers();
    const allBookings = bookingService.getBookings();
    
    // Calculate stats
    const totalRevenue = allBookings.reduce((sum, booking) => {
      return sum + (booking.totalAmount || 0);
    }, 0);

    setStats({
      totalUsers: allUsers.length,
      totalHotels: hotels.length,
      totalBookings: allBookings.length,
      revenue: totalRevenue
    });

    // Get recent bookings (last 5)
    const sortedBookings = [...allBookings].sort((a, b) => 
      new Date(b.bookingDate) - new Date(a.bookingDate)
    ).slice(0, 5);

    setRecentBookings(sortedBookings);
    setUsers(allUsers.slice(0, 10)); // First 10 users
    setLoading(false);
  }, []);

  const deleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const currentUser = userService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        alert('Cannot delete your own account!');
        return;
      }

      const allUsers = userService.getUsers();
      const updatedUsers = allUsers.filter(user => user.id !== userId);
      localStorage.setItem('travelEase_users', JSON.stringify(updatedUsers));
      
      setUsers(updatedUsers.slice(0, 10));
      setStats(prev => ({ ...prev, totalUsers: updatedUsers.length }));
      alert('User deleted successfully!');
    }
  };

  const deleteBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      const allBookings = bookingService.getBookings();
      const updatedBookings = allBookings.filter(booking => booking.id !== bookingId);
      localStorage.setItem('travelEase_bookings', JSON.stringify(updatedBookings));
      
      setRecentBookings(updatedBookings.slice(0, 5));
      setStats(prev => ({ 
        ...prev, 
        totalBookings: updatedBookings.length,
        revenue: updatedBookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0)
      }));
      alert('Booking deleted successfully!');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage your TravelEase platform</p>
      </div>

      {/* Quick Navigation */}
      <div className="quick-navigation">
        <Link to="/admin/manage-hotels" className="nav-card">
          <FaHotel />
          <span>Manage Hotels</span>
        </Link>
        <Link to="/admin/manage-users" className="nav-card">
          <FaUsers />
          <span>Manage Users</span>
        </Link>
        <Link to="/admin/manage-bookings" className="nav-card">
          <FaCalendarCheck />
          <span>Manage Bookings</span>
        </Link>
        <Link to="/admin/settings" className="nav-card">
          <FaCog />
          <span>Settings</span>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-container users">
            <FaUsers />
          </div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-container hotels">
            <FaHotel />
          </div>
          <div className="stat-info">
            <h3>Hotels</h3>
            <p>{stats.totalHotels}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-container bookings">
            <FaCalendarCheck />
          </div>
          <div className="stat-info">
            <h3>Bookings</h3>
            <p>{stats.totalBookings}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon-container revenue">
            <FaMoneyBill />
          </div>
          <div className="stat-info">
            <h3>Revenue</h3>
            <p>${stats.revenue.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Recent Bookings */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Bookings</h2>
            <Link to="/admin/manage-bookings" className="view-all-btn">
              View All
            </Link>
          </div>
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Customer</th>
                  <th>Hotel</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(booking => (
                  <tr key={booking.id}>
                    <td>#{booking.bookingNumber}</td>
                    <td>{booking.userName}</td>
                    <td>{booking.hotelName}</td>
                    <td>${booking.totalAmount || (booking.total * 1.15).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${booking.status}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn edit" title="Edit">
                          <FaEdit />
                        </button>
                        <button 
                          className="action-btn delete" 
                          onClick={() => deleteBooking(booking.id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users List */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Users</h2>
            <Link to="/admin/manage-users" className="view-all-btn">
              View All
            </Link>
          </div>
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || 'N/A'}</td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <Link 
                          to={`/admin/manage-users?edit=${user.id}`}
                          className="action-btn edit" 
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button 
                          className="action-btn delete" 
                          onClick={() => deleteUser(user.id)}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            <Link to="/admin/manage-hotels" className="quick-action-btn">
              <FaHotel />
              <span>Add New Hotel</span>
            </Link>
            <Link to="/admin/manage-users" className="quick-action-btn">
              <FaUsers />
              <span>Add New User</span>
            </Link>
            <Link to="/admin/manage-bookings" className="quick-action-btn">
              <FaList />
              <span>View Reports</span>
            </Link>
            <Link to="/admin/settings" className="quick-action-btn">
              <FaCog />
              <span>System Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;