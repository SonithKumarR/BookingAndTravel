import { useState } from 'react';
import { FaFire, FaTag, FaClock, FaHotel, FaStar, FaMapMarkerAlt } from 'react-icons/fa';
import './Deals.css';

function Deals() {
  const [deals] = useState([
    {
      id: 1,
      title: "Summer Getaway Special",
      description: "Book any beach resort and get 30% off + free breakfast",
      discount: "30% OFF",
      code: "SUMMER30",
      expires: "2024-08-31",
      image: "/images/deals/summer.jpg",
      hotels: 45,
      locations: ["Miami", "Cancun", "Bali", "Phuket"]
    },
    {
      id: 2,
      title: "Weekend Escape",
      description: "Weekend stays starting from $99 per night",
      discount: "$99/NIGHT",
      code: "WEEKEND99",
      expires: "2024-12-31",
      image: "/images/deals/weekend.jpg",
      hotels: 78,
      locations: ["New York", "Chicago", "Los Angeles", "Toronto"]
    },
    {
      id: 3,
      title: "Luxury Resort Package",
      description: "5-star luxury resorts with spa access included",
      discount: "25% OFF",
      code: "LUXURY25",
      expires: "2024-10-15",
      image: "/images/deals/luxury.jpg",
      hotels: 23,
      locations: ["Dubai", "Maldives", "Bora Bora", "Santorini"]
    },
    {
      id: 4,
      title: "Family Vacation Bundle",
      description: "Family suites with kids stay & eat free",
      discount: "40% OFF",
      code: "FAMILY40",
      expires: "2024-09-30",
      image: "/images/deals/family.jpg",
      hotels: 56,
      locations: ["Orlando", "San Diego", "Vancouver", "Gold Coast"]
    },
    {
      id: 5,
      title: "Business Traveler",
      description: "Extended stays with executive lounge access",
      discount: "20% OFF",
      code: "BUSINESS20",
      expires: "2024-11-30",
      image: "/images/deals/business.jpg",
      hotels: 89,
      locations: ["London", "Singapore", "Tokyo", "Hong Kong"]
    },
    {
      id: 6,
      title: "Last Minute Deal",
      description: "Book within 24 hours and save big",
      discount: "50% OFF",
      code: "LASTMIN50",
      expires: "2024-08-15",
      image: "/images/deals/lastminute.jpg",
      hotels: 112,
      locations: ["All Destinations"]
    }
  ]);

  const [copiedCode, setCopiedCode] = useState(null);

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="deals-page">
      <div className="deals-header">
        <div className="header-content">
          <h1>Exclusive Deals & Offers</h1>
          <p>Save big on your next stay with our special promotions</p>
          <div className="stats-bar">
            <div className="stat-item">
              <FaFire className="stat-icon" />
              <div>
                <span className="stat-number">{deals.length}</span>
                <span className="stat-label">Active Deals</span>
              </div>
            </div>
            <div className="stat-item">
              <FaHotel className="stat-icon" />
              <div>
                <span className="stat-number">403</span>
                <span className="stat-label">Participating Hotels</span>
              </div>
            </div>
            <div className="stat-item">
              <FaClock className="stat-icon" />
              <div>
                <span className="stat-number">24/7</span>
                <span className="stat-label">Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="deals-container">
        {deals.map(deal => (
          <div key={deal.id} className="deal-card">
            <div className="deal-image">
              <img src={deal.image} alt={deal.title} />
              <div className="discount-badge">
                <FaTag />
                <span>{deal.discount}</span>
              </div>
            </div>
            
            <div className="deal-content">
              <h3>{deal.title}</h3>
              <p className="deal-description">{deal.description}</p>
              
              <div className="deal-details">
                <div className="detail">
                  <FaHotel />
                  <span>{deal.hotels} hotels</span>
                </div>
                <div className="detail">
                  <FaClock />
                  <span>Expires: {formatDate(deal.expires)}</span>
                </div>
              </div>

              <div className="deal-locations">
                <h4>Available Locations:</h4>
                <div className="location-tags">
                  {deal.locations.map((location, index) => (
                    <span key={index} className="location-tag">
                      <FaMapMarkerAlt /> {location}
                    </span>
                  ))}
                </div>
              </div>

              <div className="promo-code">
                <div className="code-display">
                  <span className="code-label">Promo Code:</span>
                  <span className="code-value">{deal.code}</span>
                </div>
                <button 
                  className={`copy-btn ${copiedCode === deal.code ? 'copied' : ''}`}
                  onClick={() => copyCode(deal.code)}
                >
                  {copiedCode === deal.code ? 'Copied!' : 'Copy Code'}
                </button>
              </div>

              <button className="apply-deal-btn">
                Apply Deal & Book Now
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="deals-footer">
        <div className="terms-info">
          <h3>Terms & Conditions</h3>
          <ul>
            <li>Deals are subject to availability</li>
            <li>Blackout dates may apply</li>
            <li>Cannot be combined with other offers</li>
            <li>Promo codes must be applied at checkout</li>
            <li>Some restrictions may apply</li>
          </ul>
        </div>
        
        <div className="newsletter-signup">
          <h3>Get Deal Alerts</h3>
          <p>Subscribe to get notified about new deals</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Deals;