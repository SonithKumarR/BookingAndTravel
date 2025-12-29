import { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaEdit, FaSave } from 'react-icons/fa';
import './Profile.css';

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    address: '123 Main St, New York, NY',
    preferences: {
      newsletter: true,
      smsNotifications: false,
      language: 'English',
      currency: 'USD'
    }
  });

  const handleSave = () => {
    setIsEditing(false);
    alert('Profile updated successfully');
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <button 
          className="edit-btn"
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
        >
          {isEditing ? <><FaSave /> Save</> : <><FaEdit /> Edit Profile</>}
        </button>
      </div>

      <div className="profile-container">
        {/* Personal Info */}
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="profile-card">
            <div className="info-group">
              <FaUser />
              <div>
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
                  />
                ) : (
                  <p>{userProfile.name}</p>
                )}
              </div>
            </div>

            <div className="info-group">
              <FaEnvelope />
              <div>
                <label>Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
                  />
                ) : (
                  <p>{userProfile.email}</p>
                )}
              </div>
            </div>

            <div className="info-group">
              <FaPhone />
              <div>
                <label>Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({...userProfile, phone: e.target.value})}
                  />
                ) : (
                  <p>{userProfile.phone}</p>
                )}
              </div>
            </div>

            <div className="info-group">
              <FaMapMarkerAlt />
              <div>
                <label>Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={userProfile.address}
                    onChange={(e) => setUserProfile({...userProfile, address: e.target.value})}
                  />
                ) : (
                  <p>{userProfile.address}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="profile-section">
          <h2>Preferences</h2>
          <div className="preferences-card">
            <div className="preference">
              <label>
                <input
                  type="checkbox"
                  checked={userProfile.preferences.newsletter}
                  onChange={(e) => setUserProfile({
                    ...userProfile,
                    preferences: {...userProfile.preferences, newsletter: e.target.checked}
                  })}
                  disabled={!isEditing}
                />
                <span>Receive newsletter</span>
              </label>
            </div>

            <div className="preference">
              <label>
                <input
                  type="checkbox"
                  checked={userProfile.preferences.smsNotifications}
                  onChange={(e) => setUserProfile({
                    ...userProfile,
                    preferences: {...userProfile.preferences, smsNotifications: e.target.checked}
                  })}
                  disabled={!isEditing}
                />
                <span>SMS notifications</span>
              </label>
            </div>

            <div className="preference">
              <label>Language</label>
              <select
                value={userProfile.preferences.language}
                onChange={(e) => setUserProfile({
                  ...userProfile,
                  preferences: {...userProfile.preferences, language: e.target.value}
                })}
                disabled={!isEditing}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>

            <div className="preference">
              <label>Currency</label>
              <select
                value={userProfile.preferences.currency}
                onChange={(e) => setUserProfile({
                  ...userProfile,
                  preferences: {...userProfile.preferences, currency: e.target.value}
                })}
                disabled={!isEditing}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;