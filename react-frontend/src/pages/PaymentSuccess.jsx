import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCheckCircle, FaPrint, FaEnvelope, FaDownload, FaHome, FaBook } from 'react-icons/fa';
import { userService, bookingService } from '../services/storageService';
import './PaymentSuccess.css';

function PaymentSuccess() {
  const location = useLocation();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = userService.getCurrentUser();
    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    setUser(currentUser);

    // Simulate loading booking details
    setTimeout(() => {
      const bookings = bookingService.getUserBookings(currentUser.id);
      if (bookings.length > 0) {
        setBookingDetails(bookings[bookings.length - 1]); // Get latest booking
      }
      setLoading(false);
    }, 1000);
  }, []);

  const printBooking = () => {
    window.print();
  };

  const sendEmail = () => {
    alert('Booking confirmation sent to your email!');
  };

  const downloadReceipt = () => {
    const receiptContent = `
      TRAVEL EASE - BOOKING CONFIRMATION
      ====================================
      
      Booking ID: ${bookingDetails?.bookingNumber}
      Hotel: ${bookingDetails?.hotelName}
      Room: ${bookingDetails?.roomType}
      Check-in: ${bookingDetails?.checkIn}
      Check-out: ${bookingDetails?.checkOut}
      Guests: ${bookingDetails?.guests}
      Total Amount: $${bookingDetails?.totalAmount || 0}
      
      Thank you for choosing TravelEase!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booking-${bookingDetails?.bookingNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="payment-success-page">
      <div className="success-container">
        {/* Success Header */}
        <div className="success-header">
          <FaCheckCircle className="success-icon" />
          <h1>Payment Successful!</h1>
          <p className="success-message">
            Your booking has been confirmed. Thank you for choosing TravelEase!
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="booking-details-card">
          <div className="card-header">
            <h2>Booking Confirmation</h2>
            <span className="booking-number">
              #{bookingDetails?.bookingNumber || 'TE-' + Date.now()}
            </span>
          </div>

          <div className="booking-info">
            <div className="info-section">
              <h3>Hotel Information</h3>
              <div className="info-row">
                <span className="label">Hotel:</span>
                <span className="value">{bookingDetails?.hotelName || 'Grand Luxury Hotel'}</span>
              </div>
              <div className="info-row">
                <span className="label">Room Type:</span>
                <span className="value">{bookingDetails?.roomType || 'Deluxe Room'}</span>
              </div>
            </div>

            <div className="info-section">
              <h3>Stay Details</h3>
              <div className="info-row">
                <span className="label">Check-in:</span>
                <span className="value">{bookingDetails?.checkIn || '2024-03-15'}</span>
              </div>
              <div className="info-row">
                <span className="label">Check-out:</span>
                <span className="value">{bookingDetails?.checkOut || '2024-03-20'}</span>
              </div>
              <div className="info-row">
                <span className="label">Guests:</span>
                <span className="value">{bookingDetails?.guests || 2} guests</span>
              </div>
              <div className="info-row">
                <span className="label">Nights:</span>
                <span className="value">{bookingDetails?.nights || 5} nights</span>
              </div>
            </div>

            <div className="info-section">
              <h3>Payment Details</h3>
              <div className="info-row">
                <span className="label">Payment Method:</span>
                <span className="value">Credit Card</span>
              </div>
              <div className="info-row">
                <span className="label">Payment Status:</span>
                <span className="value success-status">Paid</span>
              </div>
              <div className="info-row">
                <span className="label">Total Amount:</span>
                <span className="value total-amount">
                  ${bookingDetails?.totalAmount || (bookingDetails?.total * 1.15).toFixed(2) || '450.00'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="action-btn print" onClick={printBooking}>
              <FaPrint /> Print
            </button>
            <button className="action-btn email" onClick={sendEmail}>
              <FaEnvelope /> Email
            </button>
            <button className="action-btn download" onClick={downloadReceipt}>
              <FaDownload /> Download
            </button>
          </div>

          {/* Next Steps */}
          <div className="next-steps">
            <h3>What's Next?</h3>
            <div className="steps-grid">
              <div className="step">
                <div className="step-number">1</div>
                <p>You'll receive a confirmation email with all details</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <p>Present your booking confirmation at check-in</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <p>Contact hotel for any special requests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="navigation-buttons">
          <Link to="/" className="nav-btn home">
            <FaHome /> Back to Home
          </Link>
          <Link to="/bookings" className="nav-btn bookings">
            <FaBook /> View All Bookings
          </Link>
        </div>

        {/* Help Section */}
        <div className="help-section">
          <h3>Need Help?</h3>
          <p>Contact our customer support:</p>
          <div className="contact-info">
            <p>📞 +1 (800) 123-4567</p>
            <p>✉️ support@travelease.com</p>
            <p>🕒 24/7 Customer Support</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentSuccess;