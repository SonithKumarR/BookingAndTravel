import { useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import HotelCard from '../components/hotel/HotelCard';
import { hotels, cities } from '../data/hotels';
import { FaFire, FaShieldAlt, FaHeadset } from 'react-icons/fa';
import './Home.css';

function Home() {
  const [featuredHotels] = useState(hotels.slice(0, 3));
  const [popularDestinations] = useState(cities);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Find Your Perfect Stay</h1>
          <p>Discover amazing hotels, resorts, and unique stays worldwide</p>
        </div>
        
        {/* Search Bar Overlay */}
        <div className="search-overlay">
          <SearchBar />
        </div>
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="feature">
          <FaShieldAlt className="feature-icon" />
          <h3>Secure Booking</h3>
          <p>Your data is protected with 256-bit encryption</p>
        </div>
        <div className="feature">
          <FaFire className="feature-icon" />
          <h3>Best Price Guarantee</h3>
          <p>Found cheaper? We'll match the price</p>
        </div>
        <div className="feature">
          <FaHeadset className="feature-icon" />
          <h3>24/7 Support</h3>
          <p>Our team is always here to help you</p>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="featured-section">
        <h2>Featured Hotels</h2>
        <div className="hotels-grid">
          {featuredHotels.map(hotel => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="destinations-section">
        <h2>Popular Destinations</h2>
        <div className="destinations-grid">
          {popularDestinations.map(city => (
            <div key={city.id} className="destination-card">
              <img src={city.image} alt={city.name} />
              <div className="destination-info">
                <h3>{city.name}</h3>
                <p>{city.country}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;