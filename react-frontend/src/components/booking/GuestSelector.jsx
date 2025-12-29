import { FaUser, FaMinus, FaPlus } from 'react-icons/fa';

function GuestSelector({ guests, onChange }) {
  const [roomCount, setRoomCount] = useState(1);

  const handleGuestChange = (type) => {
    if (type === 'increase') {
      onChange(guests + 1);
    } else if (type === 'decrease' && guests > 1) {
      onChange(guests - 1);
    }
  };

  return (
    <div className="guest-selector">
      <div className="selector-group">
        <label>
          <FaUser /> Guests
        </label>
        <div className="counter">
          <button 
            className="counter-btn"
            onClick={() => handleGuestChange('decrease')}
            disabled={guests <= 1}
          >
            <FaMinus />
          </button>
          <span className="count">{guests}</span>
          <button 
            className="counter-btn"
            onClick={() => handleGuestChange('increase')}
          >
            <FaPlus />
          </button>
        </div>
      </div>
      
      <div className="selector-group">
        <label>Rooms</label>
        <div className="counter">
          <button 
            className="counter-btn"
            onClick={() => setRoomCount(Math.max(1, roomCount - 1))}
            disabled={roomCount <= 1}
          >
            <FaMinus />
          </button>
          <span className="count">{roomCount}</span>
          <button 
            className="counter-btn"
            onClick={() => setRoomCount(roomCount + 1)}
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
}

export default GuestSelector;