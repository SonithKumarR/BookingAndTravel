import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendar, FaUser, FaSearch } from 'react-icons/fa';
import { cities } from '../../data/hotels';
import './SearchBar.css';

function SearchBar() {
  const [searchData, setSearchData] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    rooms: 1
  });
  
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results with parameters
    navigate(`/search?city=${searchData.destination}&checkIn=${searchData.checkIn}&checkOut=${searchData.checkOut}&guests=${searchData.guests}`);
  };

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSearch} className="search-form">
        {/* Destination */}
        <div className="search-field">
          <label>Destination</label>
          <div className="input-with-icon">
            <FaSearch />
            <input
              type="text"
              placeholder="Where are you going?"
              value={searchData.destination}
              onChange={(e) => setSearchData({...searchData, destination: e.target.value})}
              list="cities"
              required
            />
            <datalist id="cities">
              {cities.map(city => (
                <option key={city.id} value={city.name} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Check-in */}
        <div className="search-field">
          <label>Check-in</label>
          <div className="input-with-icon">
            <FaCalendar />
            <input
              type="date"
              min={today}
              value={searchData.checkIn}
              onChange={(e) => setSearchData({...searchData, checkIn: e.target.value})}
              required
            />
          </div>
        </div>

        {/* Check-out */}
        <div className="search-field">
          <label>Check-out</label>
          <div className="input-with-icon">
            <FaCalendar />
            <input
              type="date"
              min={searchData.checkIn || today}
              value={searchData.checkOut}
              onChange={(e) => setSearchData({...searchData, checkOut: e.target.value})}
              required
            />
          </div>
        </div>

        {/* Guests */}
        <div className="search-field">
          <label>Guests & Rooms</label>
          <div className="input-with-icon">
            <FaUser />
            <select
              value={searchData.guests}
              onChange={(e) => setSearchData({...searchData, guests: parseInt(e.target.value)})}
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'guest' : 'guests'}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Button */}
        <div className="search-field">
          <label>&nbsp;</label>
          <button type="submit" className="search-btn">
            <FaSearch />
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;