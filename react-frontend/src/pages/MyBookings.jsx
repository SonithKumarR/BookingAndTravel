import { useState, useEffect } from 'react';
import { FaCalendar, FaHotel, FaCheckCircle, FaTimesCircle, FaTrash, FaPrint } from 'react-icons/fa';
import { bookingService, userService } from '../services/storageService';
import { hotels } from '../data/hotels';
import './MyBookings.css';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = userService.getCurrentUser();
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    setUser(currentUser);
    const userBookings = bookingService.getUserBookings(currentUser.id);
    setBookings(userBookings);
    setLoading(false);
  }, []);

  const handleCancelBooking = (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        bookingService.cancelBooking(bookingId);
        const updatedBookings = bookingService.getUserBookings(user.id);
        setBookings(updatedBookings);
        alert('Booking cancelled successfully');
      } catch (error) {
        alert('Error cancelling booking: ' + error.message);
      }
    }
  };

  const getHotelImage = (hotelId) => {
    const hotel = hotels.find(h => h.id === hotelId);
    return hotel ? hotel.image : '/images/hotels/default.jpg';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading your bookings...</div>;
  }

  return (
    <div className="my-bookings-page">
      <h1>My Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <h3>No bookings yet</h3>
          <p>Start exploring hotels and make your first booking!</p>
          <a href="/search" className="explore-btn">Explore Hotels</a>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div className="booking-header">
                <div className="hotel-image-small">
                  <img src={getHotelImage(booking.hotelId)} alt={booking.hotelName} />
                </div>
                <div className="booking-title">
                  <h3>{booking.hotelName}</h3>
                  <p className="booking-number">Booking #: {booking.bookingNumber}</p>
                </div>
                <span className={`status ${booking.status}`}>
                  {booking.status === 'confirmed' ? (
                    <><FaCheckCircle /> Confirmed</>
                  ) : booking.status === 'cancelled' ? (
                    <><FaTimesCircle /> Cancelled</>
                  ) : (
                    <><FaCheckCircle /> {booking.status}</>
                  )}
                </span>
              </div>
              
              <div className="booking-details">
                <div className="detail">
                  <FaCalendar />
                  <div>
                    <strong>Check-in:</strong>
                    <p>{formatDate(booking.checkIn)}</p>
                  </div>
                  <div>
                    <strong>Check-out:</strong>
                    <p>{formatDate(booking.checkOut)}</p>
                  </div>
                  <div>
                    <strong>Booked on:</strong>
                    <p>{formatDate(booking.bookingDate)}</p>
                  </div>
                </div>
                
                <div className="detail">
                  <FaHotel />
                  <div>
                    <strong>Room Type:</strong>
                    <p>{booking.roomType}</p>
                  </div>
                  <div>
                    <strong>Guests:</strong>
                    <p>{booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}</p>
                  </div>
                  <div>
                    <strong>Nights:</strong>
                    <p>{booking.nights} {booking.nights === 1 ? 'night' : 'nights'}</p>
                  </div>
                </div>
                
                <div className="detail">
                  <div className="price-section">
                    <strong>Total Amount:</strong>
                    <p className="total-amount">${booking.totalAmount || (booking.total * 1.15).toFixed(2)}</p>
                  </div>
                  
                  <div className="booking-actions">
                    <button className="action-btn print" title="Print booking">
                      <FaPrint /> Print
                    </button>
                    {booking.status === 'confirmed' && (
                      <button 
                        className="action-btn cancel" 
                        onClick={() => handleCancelBooking(booking.id)}
                        title="Cancel booking"
                      >
                        <FaTrash /> Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyBookings;