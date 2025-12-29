import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaBars, FaTimes, FaSearch, FaSignOutAlt, FaChartLine, FaHotel, FaUsers, FaHeart, FaCalendarCheck } from 'react-icons/fa';
import { userService } from '../../services/storageService';
import './Header.css';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const currentUser = userService.getCurrentUser();
    setUser(currentUser);
    
    // Check if user is admin
    if (currentUser) {
      const adminCheck = currentUser.email === 'sonith@gmail.com.com' || 
                        currentUser.email === 'kumar@gmail.com.com' || 
                        currentUser.email.includes('admin');
      setIsAdmin(adminCheck);
    } else {
      setIsAdmin(false);
    }
  }, []);

  const handleLogout = () => {
    userService.logout();
    setUser(null);
    setIsAdmin(false);
    navigate('/');
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <Link to="/" className="logo">
          <span className="logo-main">Travel</span>
          <span className="logo-secondary">Ease</span>
        </Link>

        {/* Main Navigation */}
        <nav className={`main-nav ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/search" onClick={() => setIsMenuOpen(false)}>Hotels</Link>
          <Link to="/destinations" onClick={() => setIsMenuOpen(false)}>Destinations</Link>
          <Link to="/deals" onClick={() => setIsMenuOpen(false)}>Deals</Link>
          {user && (
            <>
              <Link to="/bookings" onClick={() => setIsMenuOpen(false)}>My Bookings</Link>
              <Link to="/wishlist" onClick={() => setIsMenuOpen(false)}>Wishlist</Link>
            </>
          )}
        </nav>

        {/* User Actions */}
        <div className="user-actions">
          {user ? (
            <div className="user-dropdown">
              <button className="user-btn">
                <FaUser />
                <span>{user.name ? user.name.split(' ')[0] : 'User'}</span>
                {isAdmin && <span className="admin-badge">ADMIN</span>}
              </button>
              <div className="dropdown-menu">
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="dropdown-item">
                  <FaUser /> Profile
                </Link>
                <Link to="/bookings" onClick={() => setIsMenuOpen(false)} className="dropdown-item">
                  <FaCalendarCheck /> My Bookings
                </Link>
                <Link to="/wishlist" onClick={() => setIsMenuOpen(false)} className="dropdown-item">
                  <FaHeart /> Wishlist
                </Link>
                
                {isAdmin && (
                  <>
                    <div className="dropdown-divider"></div>
                    <div className="dropdown-section">Admin Panel</div>
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="dropdown-item">
                      <FaChartLine /> Dashboard
                    </Link>
                    <Link to="/admin/manage-hotels" onClick={() => setIsMenuOpen(false)} className="dropdown-item">
                      <FaHotel /> Manage Hotels
                    </Link>
                    <Link to="/admin/manage-users" onClick={() => setIsMenuOpen(false)} className="dropdown-item">
                      <FaUsers /> Manage Users
                    </Link>
                    <div className="dropdown-divider"></div>
                  </>
                )}
                
                <button onClick={handleLogout} className="logout-btn dropdown-item">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-login" onClick={() => setIsMenuOpen(false)}>Login</Link>
              <Link to="/signup" className="btn-signup" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </header>
  );
}

export default Header;