import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaMapMarkerAlt, FaWifi, FaSwimmingPool, FaSpa, FaParking, FaUtensils, FaHeart } from 'react-icons/fa';
import { hotels } from '../data/hotels';
import { wishlistService, userService } from '../services/storageService';
import './HotelDetails.css';

function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingDates, setBookingDates] = useState({
    checkIn: '',
    checkOut: '',
    guests: 2
  });
  const [nights, setNights] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundHotel = hotels.find(h => h.id === parseInt(id));
    if (foundHotel) {
      setHotel(foundHotel);
      setSelectedRoom(foundHotel.rooms[0]);
    }

    const currentUser = userService.getCurrentUser();
    setUser(currentUser);
    
    if (currentUser) {
      const inWishlist = wishlistService.isInWishlist(parseInt(id));
      setIsInWishlist(inWishlist);
    }
    
    setLoading(false);
  }, [id]);

  const handleWishlistToggle = () => {
    if (!user) {
      alert('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    try {
      if (isInWishlist) {
        wishlistService.removeFromWishlist(hotel.id);
        setIsInWishlist(false);
        alert('Removed from wishlist');
      } else {
        wishlistService.addToWishlist(hotel.id, hotel.name);
        setIsInWishlist(true);
        alert('Added to wishlist!');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleBooking = () => {
    if (!user) {
      alert('Please login to book');
      navigate('/login');
      return;
    }

    if (!bookingDates.checkIn || !bookingDates.checkOut) {
      alert('Please select dates');
      return;
    }

    const bookingData = {
      hotelId: hotel.id,
      hotelName: hotel.name,
      roomType: selectedRoom.type,
      price: selectedRoom.price,
      total: selectedRoom.price * nights,
      ...bookingDates,
      nights
    };

    navigate('/booking', { state: bookingData });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading hotel details...</p>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="not-found">
        <h2>Hotel not found</h2>
        <p>The hotel you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/')}>Go Back Home</button>
      </div>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="hotel-details-page">
      <div className="hotel-content">
        {/* Hotel Header */}
        <div className="hotel-header">
          <h1>{hotel.name}</h1>
          <div className="hotel-rating">
            <div className="rating-badge">
              <FaStar className="star" />
              <span>{hotel.rating}</span>
              <span className="reviews">({hotel.reviews} reviews)</span>
            </div>
            <div className="location">
              <FaMapMarkerAlt />
              <span>{hotel.city}, {hotel.country}</span>
            </div>
            <button 
              className={`wishlist-btn-details ${isInWishlist ? 'active' : ''}`}
              onClick={handleWishlistToggle}
            >
              <FaHeart />
              {isInWishlist ? ' Saved' : ' Save'}
            </button>
          </div>
        </div>

        {/* Hotel Image */}
        <div className="hotel-main-image">
          <img src={hotel.image} alt={hotel.name} />
        </div>

        {/* Description */}
        <div className="hotel-description">
          <h2>About this hotel</h2>
          <p>{hotel.description}</p>
        </div>

        {/* Amenities */}
        <div className="amenities-section">
          <h2>What this place offers</h2>
          <div className="amenities-list">
            {hotel.amenities.map((amenity, index) => (
              <div key={index} className="amenity-item">
                {amenity === 'WiFi' && <FaWifi />}
                {amenity === 'Pool' && <FaSwimmingPool />}
                {amenity === 'Spa' && <FaSpa />}
                {amenity === 'Parking' && <FaParking />}
                {amenity === 'Restaurant' && <FaUtensils />}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Room Selection */}
        <div className="rooms-section">
          <h2>Available Rooms</h2>
          <div className="rooms-list">
            {hotel.rooms.map((room, index) => (
              <div 
                key={index} 
                className={`room-card ${selectedRoom === room ? 'selected' : ''}`}
                onClick={() => setSelectedRoom(room)}
              >
                <div className="room-info">
                  <h3>{room.type}</h3>
                  <p>Available: {room.available} rooms</p>
                  <p className="room-desc">Comfortable room with all basic amenities</p>
                </div>
                <div className="room-price">
                  <span className="price">${room.price}</span>
                  <span className="period">/night</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Widget */}
      <div className="booking-widget">
        <div className="widget-header">
          <h3>Book Your Stay</h3>
          <div className="price-display">
            <span className="price">${selectedRoom?.price}</span>
            <span className="period">/night</span>
          </div>
        </div>

        <div className="booking-form">
          {/* Check-in */}
          <div className="form-group">
            <label>Check-in</label>
            <input
              type="date"
              min={today}
              value={bookingDates.checkIn}
              onChange={(e) => {
                setBookingDates({...bookingDates, checkIn: e.target.value});
                // Calculate nights
                if (bookingDates.checkOut) {
                  const diff = new Date(bookingDates.checkOut) - new Date(e.target.value);
                  setNights(Math.ceil(diff / (1000 * 60 * 60 * 24)));
                }
              }}
              className="date-input"
            />
          </div>

          {/* Check-out */}
          <div className="form-group">
            <label>Check-out</label>
            <input
              type="date"
              min={bookingDates.checkIn || today}
              value={bookingDates.checkOut}
              onChange={(e) => {
                setBookingDates({...bookingDates, checkOut: e.target.value});
                // Calculate nights
                if (bookingDates.checkIn) {
                  const diff = new Date(e.target.value) - new Date(bookingDates.checkIn);
                  setNights(Math.ceil(diff / (1000 * 60 * 60 * 24)));
                }
              }}
              className="date-input"
            />
          </div>

          {/* Guests */}
          <div className="form-group">
            <label>Guests</label>
            <select
              value={bookingDates.guests}
              onChange={(e) => setBookingDates({...bookingDates, guests: parseInt(e.target.value)})}
              className="guest-select"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
              ))}
            </select>
          </div>

          <div className="price-summary">
            <div className="price-row">
              <span>${selectedRoom?.price} x {nights} nights</span>
              <span>${selectedRoom?.price * nights}</span>
            </div>
            <div className="price-row">
              <span>Taxes & fees (15%)</span>
              <span>${(selectedRoom?.price * nights * 0.15).toFixed(2)}</span>
            </div>
            <div className="price-row total">
              <span>Total</span>
              <span>${(selectedRoom?.price * nights * 1.15).toFixed(2)}</span>
            </div>
          </div>

          <button 
            className="book-now-btn"
            onClick={handleBooking}
            disabled={selectedRoom?.available === 0}
          >
            {selectedRoom?.available === 0 ? 'Sold Out' : 'Book Now'}
          </button>

          <div className="security-info">
            <p>✅ Free cancellation before check-in</p>
            <p>✅ Best price guarantee</p>
            <p>✅ No booking fees</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HotelDetails;