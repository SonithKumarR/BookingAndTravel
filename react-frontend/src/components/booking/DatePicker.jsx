import { useState } from 'react';
import { FaCalendar } from 'react-icons/fa';

function DatePicker({ dates, onChange, onNightsChange }) {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const handleDateChange = (type, value) => {
    const newDates = { ...dates, [type]: value };
    onChange(newDates);
    
    // Calculate nights if both dates are selected
    if (newDates.checkIn && newDates.checkOut) {
      const diffTime = Math.abs(new Date(newDates.checkOut) - new Date(newDates.checkIn));
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      onNightsChange(diffDays);
    }
  };

  return (
    <div className="date-picker">
      <div className="date-group">
        <label>Check-in</label>
        <div className="input-with-icon">
          <FaCalendar />
          <input
            type="date"
            min={today}
            value={dates.checkIn}
            onChange={(e) => handleDateChange('checkIn', e.target.value)}
            required
          />
        </div>
      </div>
      
      <div className="date-group">
        <label>Check-out</label>
        <div className="input-with-icon">
          <FaCalendar />
          <input
            type="date"
            min={dates.checkIn || today}
            value={dates.checkOut}
            onChange={(e) => handleDateChange('checkOut', e.target.value)}
            required
          />
        </div>
      </div>
    </div>
  );
}

export default DatePicker;