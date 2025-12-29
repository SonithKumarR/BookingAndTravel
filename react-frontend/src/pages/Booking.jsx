import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaCreditCard, FaShieldAlt } from 'react-icons/fa';
import { bookingService, userService } from '../services/storageService';
import './Booking.css';

function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = userService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (location.state) {
      setBookingData(location.state);
    } else {
      navigate('/');
    }
  }, [location.state, navigate]);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Create booking in localStorage
      const booking = await bookingService.createBooking({
        ...bookingData,
        paymentMethod,
        cardLastFour: cardDetails.number.slice(-4),
        totalAmount: (bookingData.total * 1.15).toFixed(2) // Including taxes
      });
      
      // Navigate to payment success page
      navigate('/payment-success', { 
        state: { 
          bookingId: booking.id,
          bookingNumber: booking.bookingNumber 
        } 
      });
      
    } catch (error) {
      alert('Error creating booking: ' + error.message);
      setLoading(false);
    }
  };

  if (!bookingData) {
    return <div className="loading">Loading booking details...</div>;
  }

  if (success) {
    return (
      <div className="booking-success">
        <div className="success-container">
          <FaCheckCircle className="success-icon" />
          <h2>Booking Confirmed!</h2>
          <p>Your booking has been successfully confirmed.</p>
          <p>Check your email for confirmation details.</p>
          <Link to="/bookings" className="view-bookings-btn">
            View My Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page">
      <div className="booking-container">
        {/* Booking Summary */}
        <div className="booking-summary">
          <h2>Booking Summary</h2>
          <div className="summary-card">
            <h3>{bookingData.hotelName}</h3>
            <p>Room: {bookingData.roomType}</p>
            <p>Dates: {bookingData.checkIn} to {bookingData.checkOut}</p>
            <p>Guests: {bookingData.guests}</p>
            <p>Nights: {bookingData.nights}</p>
            <div className="price-breakdown">
              <div className="price-row">
                <span>Room price:</span>
                <span>${bookingData.price} x {bookingData.nights} nights</span>
                <span>${bookingData.total}</span>
              </div>
              <div className="price-row">
                <span>Taxes & fees (15%):</span>
                <span></span>
                <span>${(bookingData.total * 0.15).toFixed(2)}</span>
              </div>
              <div className="price-row total">
                <span>Total:</span>
                <span></span>
                <span>${(bookingData.total * 1.15).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="payment-section">
          <h2>Payment Details</h2>
          
          <div className="payment-methods">
            <div className="method-selector">
              <button 
                className={`method-btn ${paymentMethod === 'credit' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('credit')}
                disabled={loading}
              >
                <FaCreditCard /> Credit Card
              </button>
            </div>

            {paymentMethod === 'credit' && (
              <div className="card-form">
                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    value={cardDetails.number}
                    onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                    disabled={loading}
                  />
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      maxLength="3"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="security-info">
              <FaShieldAlt />
              <span>Your payment is secured with 256-bit SSL encryption</span>
            </div>

            <button 
              className="confirm-btn" 
              onClick={handlePayment}
              disabled={loading || !cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv}
            >
              {loading ? 'Processing...' : (
                <>
                  <FaCheckCircle />
                  Confirm Booking & Pay ${(bookingData.total * 1.15).toFixed(2)}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;