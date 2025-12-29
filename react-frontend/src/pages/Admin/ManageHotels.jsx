import { useState, useEffect } from 'react';
import { FaHotel, FaPlus, FaEdit, FaTrash, FaImage, FaDollarSign, FaMapMarkerAlt, FaStar, FaBed } from 'react-icons/fa';
import { hotels as initialHotels } from '../../data/hotels';
import './ManageHotels.css';

function ManageHotels() {
  const [hotels, setHotels] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingHotel, setEditingHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  const [hotelForm, setHotelForm] = useState({
    name: '',
    city: '',
    country: '',
    price: '',
    rating: '',
    reviews: '',
    image: '',
    description: '',
    amenities: '',
    rooms: ''
  });

  useEffect(() => {
    // Load hotels from localStorage or use initial data
    const storedHotels = localStorage.getItem('travelEase_hotels');
    if (storedHotels) {
      setHotels(JSON.parse(storedHotels));
    } else {
      setHotels(initialHotels);
      localStorage.setItem('travelEase_hotels', JSON.stringify(initialHotels));
    }
    setLoading(false);
  }, []);

  const saveHotels = (updatedHotels) => {
    setHotels(updatedHotels);
    localStorage.setItem('travelEase_hotels', JSON.stringify(updatedHotels));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHotelForm({
      ...hotelForm,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newHotel = {
      id: editingHotel ? editingHotel.id : hotels.length + 1,
      name: hotelForm.name,
      city: hotelForm.city,
      country: hotelForm.country,
      price: parseFloat(hotelForm.price),
      rating: parseFloat(hotelForm.rating),
      reviews: parseInt(hotelForm.reviews),
      image: hotelForm.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      description: hotelForm.description,
      amenities: hotelForm.amenities.split(',').map(a => a.trim()),
      rooms: hotelForm.rooms.split(',').map(room => {
        const [type, price, available] = room.split('|').map(item => item.trim());
        return {
          type,
          price: parseFloat(price),
          available: parseInt(available)
        };
      })
    };

    let updatedHotels;
    if (editingHotel) {
      // Update existing hotel
      updatedHotels = hotels.map(h => h.id === editingHotel.id ? newHotel : h);
    } else {
      // Add new hotel
      updatedHotels = [...hotels, newHotel];
    }

    saveHotels(updatedHotels);
    resetForm();
    alert(editingHotel ? 'Hotel updated successfully!' : 'Hotel added successfully!');
  };

  const resetForm = () => {
    setHotelForm({
      name: '',
      city: '',
      country: '',
      price: '',
      rating: '',
      reviews: '',
      image: '',
      description: '',
      amenities: '',
      rooms: ''
    });
    setEditingHotel(null);
    setShowForm(false);
  };

  const editHotel = (hotel) => {
    setEditingHotel(hotel);
    setHotelForm({
      name: hotel.name,
      city: hotel.city,
      country: hotel.country,
      price: hotel.price.toString(),
      rating: hotel.rating.toString(),
      reviews: hotel.reviews.toString(),
      image: hotel.image,
      description: hotel.description,
      amenities: hotel.amenities.join(', '),
      rooms: hotel.rooms.map(room => `${room.type}|${room.price}|${room.available}`).join(', ')
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteHotel = (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      const updatedHotels = hotels.filter(hotel => hotel.id !== id);
      saveHotels(updatedHotels);
      alert('Hotel deleted successfully!');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading hotels...</p>
      </div>
    );
  }

  return (
    <div className="manage-hotels">
      <div className="manage-header">
        <h1><FaHotel /> Hotel Management</h1>
        <button 
          className="add-hotel-btn"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <FaPlus /> Add New Hotel
        </button>
      </div>

      {/* Hotel Form */}
      {showForm && (
        <div className="hotel-form-container">
          <div className="form-header">
            <h2>{editingHotel ? 'Edit Hotel' : 'Add New Hotel'}</h2>
            <button className="close-form" onClick={resetForm}>×</button>
          </div>
          
          <form onSubmit={handleSubmit} className="hotel-form">
            <div className="form-grid">
              <div className="form-group">
                <label><FaHotel /> Hotel Name *</label>
                <input
                  type="text"
                  name="name"
                  value={hotelForm.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter hotel name"
                />
              </div>

              <div className="form-group">
                <label><FaMapMarkerAlt /> City *</label>
                <input
                  type="text"
                  name="city"
                  value={hotelForm.city}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter city"
                />
              </div>

              <div className="form-group">
                <label><FaMapMarkerAlt /> Country *</label>
                <input
                  type="text"
                  name="country"
                  value={hotelForm.country}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter country"
                />
              </div>

              <div className="form-group">
                <label><FaDollarSign /> Price per Night *</label>
                <input
                  type="number"
                  name="price"
                  value={hotelForm.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter price"
                />
              </div>

              <div className="form-group">
                <label><FaStar /> Rating (1-5) *</label>
                <input
                  type="number"
                  name="rating"
                  value={hotelForm.rating}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="5"
                  step="0.1"
                  placeholder="Enter rating"
                />
              </div>

              <div className="form-group">
                <label>Reviews Count *</label>
                <input
                  type="number"
                  name="reviews"
                  value={hotelForm.reviews}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="Enter number of reviews"
                />
              </div>

              <div className="form-group full-width">
                <label><FaImage /> Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={hotelForm.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-group full-width">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={hotelForm.description}
                  onChange={handleInputChange}
                  required
                  rows="3"
                  placeholder="Enter hotel description"
                />
              </div>

              <div className="form-group full-width">
                <label>Amenities (comma separated) *</label>
                <input
                  type="text"
                  name="amenities"
                  value={hotelForm.amenities}
                  onChange={handleInputChange}
                  required
                  placeholder="WiFi, Pool, Spa, Gym, Restaurant, Parking"
                />
                <small>Separate amenities with commas</small>
              </div>

              <div className="form-group full-width">
                <label><FaBed /> Rooms (Type|Price|Available) *</label>
                <input
                  type="text"
                  name="rooms"
                  value={hotelForm.rooms}
                  onChange={handleInputChange}
                  required
                  placeholder="Deluxe Room|299|5, Executive Suite|499|2"
                />
                <small>Format: Room Type|Price|Available Count (comma separated)</small>
              </div>
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                {editingHotel ? 'Update Hotel' : 'Add Hotel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Hotels List */}
      <div className="hotels-list-container">
        <h2>All Hotels ({hotels.length})</h2>
        
        <div className="hotels-grid">
          {hotels.map(hotel => (
            <div key={hotel.id} className="hotel-card-admin">
              <div className="hotel-image-admin">
                <img src={hotel.image} alt={hotel.name} />
                <div className="hotel-actions">
                  <button 
                    className="action-btn edit"
                    onClick={() => editHotel(hotel)}
                    title="Edit Hotel"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    className="action-btn delete"
                    onClick={() => deleteHotel(hotel.id)}
                    title="Delete Hotel"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <div className="hotel-info-admin">
                <h3>{hotel.name}</h3>
                <p className="location">
                  <FaMapMarkerAlt /> {hotel.city}, {hotel.country}
                </p>
                
                <div className="hotel-stats">
                  <div className="stat">
                    <FaDollarSign />
                    <span>${hotel.price}/night</span>
                  </div>
                  <div className="stat">
                    <FaStar />
                    <span>{hotel.rating} ({hotel.reviews} reviews)</span>
                  </div>
                </div>

                <p className="description">{hotel.description.substring(0, 100)}...</p>

                <div className="amenities-list">
                  {hotel.amenities.slice(0, 4).map((amenity, index) => (
                    <span key={index} className="amenity-tag">{amenity}</span>
                  ))}
                  {hotel.amenities.length > 4 && (
                    <span className="amenity-tag">+{hotel.amenities.length - 4}</span>
                  )}
                </div>

                <div className="rooms-summary">
                  <FaBed /> {hotel.rooms.length} room types available
                </div>
              </div>
            </div>
          ))}
        </div>

        {hotels.length === 0 && (
          <div className="empty-state">
            <FaHotel className="empty-icon" />
            <h3>No hotels found</h3>
            <p>Add your first hotel to get started</p>
            <button 
              className="add-first-btn"
              onClick={() => setShowForm(true)}
            >
              <FaPlus /> Add First Hotel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageHotels;