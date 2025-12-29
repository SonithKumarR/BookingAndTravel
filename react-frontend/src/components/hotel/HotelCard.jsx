import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaWifi, FaSwimmingPool, FaParking, FaHeart } from 'react-icons/fa';
import { wishlistService, userService } from '../../services/storageService';
import './HotelCard.css';

function HotelCard({ hotel }) {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = userService.getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      const inWishlist = wishlistService.isInWishlist(hotel.id);
      setIsInWishlist(inWishlist);
    }
  }, [hotel.id]);

  const handleWishlistToggle = () => {
    if (!user) {
      alert('Please login to add to wishlist');
      return;
    }

    try {
      if (isInWishlist) {
        wishlistService.removeFromWishlist(hotel.id);
        setIsInWishlist(false);
      } else {
        wishlistService.addToWishlist(hotel.id, hotel.name);
        setIsInWishlist(true);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="hotel-card">
      {/* Hotel Image */}
      <div className="hotel-image">
        <img src={hotel.image} alt={hotel.name} />
        <button 
          className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
          onClick={handleWishlistToggle}
          title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FaHeart />
        </button>
      </div>

      {/* Hotel Info */}
      <div className="hotel-info">
        <div className="hotel-header">
          <h3>{hotel.name}</h3>
          <div className="rating">
            <FaStar className="star-icon" />
            <span>{hotel.rating}</span>
            <span className="reviews">({hotel.reviews} reviews)</span>
          </div>
        </div>

        <div className="location">
          <FaMapMarkerAlt />
          <span>{hotel.city}, {hotel.country}</span>
        </div>

        <p className="description">{hotel.description}</p>

        {/* Amenities */}
        <div className="amenities">
          {hotel.amenities.slice(0, 4).map((amenity, index) => (
            <span key={index} className="amenity">
              {amenity === 'WiFi' && <FaWifi />}
              {amenity === 'Pool' && <FaSwimmingPool />}
              {amenity === 'Parking' && <FaParking />}
              {amenity}
            </span>
          ))}
        </div>

        {/* Price & Action */}
        <div className="hotel-footer">
          <div className="price">
            <span className="price-amount">${hotel.price}</span>
            <span className="price-period">/night</span>
          </div>
          <Link to={`/hotel/${hotel.id}`} className="view-details-btn">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HotelCard;