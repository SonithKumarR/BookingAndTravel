import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaTrash, FaSearch } from 'react-icons/fa';
import { wishlistService, userService } from '../services/storageService';
import { hotels } from '../data/hotels';
import './Wishlist.css';

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = userService.getCurrentUser();
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    const userWishlist = wishlistService.getUserWishlist();
    setWishlist(userWishlist);
    setLoading(false);
  }, []);

  const removeFromWishlist = (hotelId) => {
    try {
      wishlistService.removeFromWishlist(hotelId);
      const updatedWishlist = wishlistService.getUserWishlist();
      setWishlist(updatedWishlist);
    } catch (error) {
      alert('Error removing from wishlist: ' + error.message);
    }
  };

  const getHotelDetails = (hotelId) => {
    return hotels.find(h => h.id === hotelId);
  };

  if (loading) {
    return <div className="loading">Loading wishlist...</div>;
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <FaHeart className="empty-icon" />
          <h3>Your wishlist is empty</h3>
          <p>Save hotels you love by clicking the heart icon</p>
          <Link to="/search" className="explore-btn">
            <FaSearch /> Explore Hotels
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map(item => {
            const hotel = getHotelDetails(item.hotelId);
            if (!hotel) return null;

            return (
              <div key={item.id} className="wishlist-card">
                <div className="wishlist-image">
                  <img src={hotel.image} alt={hotel.name} />
                  <button 
                    className="remove-wishlist"
                    onClick={() => removeFromWishlist(hotel.id)}
                    title="Remove from wishlist"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="wishlist-info">
                  <h3>{hotel.name}</h3>
                  <p className="location">{hotel.city}, {hotel.country}</p>
                  <p className="description">{hotel.description}</p>
                  <div className="wishlist-footer">
                    <div className="price">
                      <span className="price-amount">${hotel.price}</span>
                      <span className="price-period">/night</span>
                    </div>
                    <Link to={`/hotel/${hotel.id}`} className="view-hotel-btn">
                      View Hotel
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Wishlist;