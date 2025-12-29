import { useState } from 'react';
import { FaMapMarkerAlt, FaStar, FaHotel, FaPlane, FaUtensils } from 'react-icons/fa';
import './Destinations.css';

function Destinations() {
  const [destinations] = useState([
    {
      id: 1,
      name: "New York",
      country: "USA",
      image: "/images/destinations/ny.jpg",
      description: "The city that never sleeps. Experience Broadway, Times Square, and world-class museums.",
      hotels: 245,
      avgPrice: 250,
      rating: 4.7,
      highlights: ["Broadway Shows", "Central Park", "Statue of Liberty", "Museums"]
    },
    {
      id: 2,
      name: "Paris",
      country: "France",
      image: "/images/destinations/paris.jpg",
      description: "The city of love and lights. Explore the Eiffel Tower, Louvre, and charming cafes.",
      hotels: 189,
      avgPrice: 220,
      rating: 4.8,
      highlights: ["Eiffel Tower", "Louvre Museum", "Notre Dame", "Seine River Cruise"]
    },
    {
      id: 3,
      name: "Tokyo",
      country: "Japan",
      image: "/images/destinations/tokyo.jpg",
      description: "Where tradition meets futuristic innovation. Discover ancient temples and neon-lit streets.",
      hotels: 312,
      avgPrice: 180,
      rating: 4.6,
      highlights: ["Shibuya Crossing", "Tokyo Tower", "Senso-ji Temple", "Akihabara"]
    },
    {
      id: 4,
      name: "Dubai",
      country: "UAE",
      image: "/images/destinations/dubai.jpg",
      description: "A city of superlatives with the world's tallest building and luxurious shopping.",
      hotels: 156,
      avgPrice: 350,
      rating: 4.9,
      highlights: ["Burj Khalifa", "Palm Jumeirah", "Dubai Mall", "Desert Safari"]
    },
    {
      id: 5,
      name: "Sydney",
      country: "Australia",
      image: "/images/destinations/sydney.jpg",
      description: "Beautiful harbor city with iconic Opera House and stunning beaches.",
      hotels: 198,
      avgPrice: 200,
      rating: 4.7,
      highlights: ["Sydney Opera House", "Bondi Beach", "Harbour Bridge", "Blue Mountains"]
    },
    {
      id: 6,
      name: "Bali",
      country: "Indonesia",
      image: "/images/destinations/bali.jpg",
      description: "Tropical paradise with beautiful beaches, temples, and vibrant culture.",
      hotels: 423,
      avgPrice: 120,
      rating: 4.5,
      highlights: ["Ubud", "Tanah Lot Temple", "Uluwatu", "Rice Terraces"]
    }
  ]);

  return (
    <div className="destinations-page">
      <div className="destinations-header">
        <h1>Popular Destinations</h1>
        <p>Explore amazing places around the world for your next adventure</p>
      </div>

      <div className="destinations-grid">
        {destinations.map(destination => (
          <div key={destination.id} className="destination-card">
            <div className="destination-image">
              <img src={destination.image} alt={destination.name} />
              <div className="destination-overlay">
                <h3>{destination.name}</h3>
                <p>{destination.country}</p>
              </div>
            </div>
            
            <div className="destination-info">
              <p className="description">{destination.description}</p>
              
              <div className="destination-stats">
                <div className="stat">
                  <FaHotel />
                  <span>{destination.hotels} hotels</span>
                </div>
                <div className="stat">
                  <FaStar />
                  <span>{destination.rating} rating</span>
                </div>
                <div className="stat">
                  <span className="price">${destination.avgPrice}/night</span>
                </div>
              </div>

              <div className="highlights">
                <h4>Top Highlights</h4>
                <div className="highlight-tags">
                  {destination.highlights.map((highlight, index) => (
                    <span key={index} className="highlight-tag">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              <button className="explore-btn">
                Explore {destination.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Destinations;