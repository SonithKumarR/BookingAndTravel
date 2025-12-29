import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HotelCard from '../components/hotel/HotelCard';
import { hotels } from '../data/hotels';
import { FaFilter, FaSortAmountDown, FaStar } from 'react-icons/fa';
import './SearchResults.css';

function SearchResults() {
  const [searchParams] = useSearchParams();
  const [filteredHotels, setFilteredHotels] = useState(hotels);
  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
    sortBy: 'recommended'
  });

  useEffect(() => {
    const city = searchParams.get('city');
    const guests = parseInt(searchParams.get('guests') || '2');
    
    let results = hotels;
    
    // Filter by city if provided
    if (city) {
      results = results.filter(hotel => 
        hotel.city.toLowerCase().includes(city.toLowerCase())
      );
    }
    
    // Apply other filters
    results = results.filter(hotel => 
      hotel.price >= filters.minPrice && 
      hotel.price <= filters.maxPrice &&
      hotel.rating >= filters.rating
    );
    
    // Apply sorting
    switch(filters.sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // recommended - default order
        break;
    }
    
    setFilteredHotels(results);
  }, [searchParams, filters]);

  return (
    <div className="search-results-page">
      <div className="results-header">
        <h1>Hotels in {searchParams.get('city') || 'All Locations'}</h1>
        <p>{filteredHotels.length} properties found</p>
      </div>

      <div className="results-container">
        {/* Filters Sidebar */}
        <div className="filters-sidebar">
          <div className="filter-section">
            <h3><FaFilter /> Filters</h3>
            
            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-range">
                <span>${filters.minPrice}</span>
                <span>${filters.maxPrice}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                className="price-slider"
              />
            </div>
            
            <div className="filter-group">
              <label>Minimum Rating</label>
              <div className="rating-filter">
                {[4, 3, 2, 1].map(rating => (
                  <button
                    key={rating}
                    className={`rating-btn ${filters.rating === rating ? 'active' : ''}`}
                    onClick={() => setFilters({...filters, rating: filters.rating === rating ? 0 : rating})}
                  >
                    <FaStar /> {rating}+
                  </button>
                ))}
              </div>
            </div>
            
            <div className="filter-group">
              <label>Amenities</label>
              {['WiFi', 'Pool', 'Spa', 'Parking', 'Restaurant'].map(amenity => (
                <label key={amenity} className="amenity-checkbox">
                  <input type="checkbox" />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Results Main Area */}
        <div className="results-main">
          <div className="sort-options">
            <select 
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value})}
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
            <FaSortAmountDown className="sort-icon" />
          </div>

          <div className="hotels-list">
            {filteredHotels.length > 0 ? (
              filteredHotels.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))
            ) : (
              <div className="no-results">
                <h3>No hotels found</h3>
                <p>Try adjusting your filters or search criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;