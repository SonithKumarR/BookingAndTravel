import { useState } from 'react';
import { FaCog, FaSave, FaGlobe, FaBell, FaLock, FaPalette } from 'react-icons/fa';
import './Settings.css';

function Settings() {
  const [settings, setSettings] = useState({
    siteName: 'TravelEase',
    siteEmail: 'support@travelease.com',
    sitePhone: '+1 (800) 123-4567',
    currency: 'USD',
    timezone: 'America/New_York',
    maintenanceMode: false,
    allowRegistrations: true,
    enableNotifications: true,
    primaryColor: '#667eea',
    secondaryColor: '#764ba2'
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings to localStorage
    localStorage.setItem('travelEase_settings', JSON.stringify(settings));
    alert('Settings saved successfully!');
  };

  const resetToDefaults = () => {
    if (window.confirm('Are you sure you want to reset all settings to defaults?')) {
      const defaultSettings = {
        siteName: 'TravelEase',
        siteEmail: 'support@travelease.com',
        sitePhone: '+1 (800) 123-4567',
        currency: 'USD',
        timezone: 'America/New_York',
        maintenanceMode: false,
        allowRegistrations: true,
        enableNotifications: true,
        primaryColor: '#667eea',
        secondaryColor: '#764ba2'
      };
      setSettings(defaultSettings);
      localStorage.setItem('travelEase_settings', JSON.stringify(defaultSettings));
      alert('Settings reset to defaults!');
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1><FaCog /> System Settings</h1>
        <p>Configure your TravelEase platform settings</p>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        {/* General Settings */}
        <div className="settings-section">
          <h2><FaGlobe /> General Settings</h2>
          <div className="settings-grid">
            <div className="setting-group">
              <label>Site Name</label>
              <input
                type="text"
                name="siteName"
                value={settings.siteName}
                onChange={handleInputChange}
                placeholder="Enter site name"
              />
            </div>
            <div className="setting-group">
              <label>Support Email</label>
              <input
                type="email"
                name="siteEmail"
                value={settings.siteEmail}
                onChange={handleInputChange}
                placeholder="Enter support email"
              />
            </div>
            <div className="setting-group">
              <label>Support Phone</label>
              <input
                type="tel"
                name="sitePhone"
                value={settings.sitePhone}
                onChange={handleInputChange}
                placeholder="Enter support phone"
              />
            </div>
            <div className="setting-group">
              <label>Default Currency</label>
              <select
                name="currency"
                value={settings.currency}
                onChange={handleInputChange}
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div className="setting-group">
              <label>Timezone</label>
              <select
                name="timezone"
                value={settings.timezone}
                onChange={handleInputChange}
              >
                <option value="America/New_York">New York (EST)</option>
                <option value="America/Los_Angeles">Los Angeles (PST)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Asia/Dubai">Dubai (GST)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="settings-section">
          <h2><FaLock /> System Settings</h2>
          <div className="settings-grid">
            <div className="setting-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleInputChange}
                />
                <span>Enable Maintenance Mode</span>
                <small>Site will be unavailable to users</small>
              </label>
            </div>
            <div className="setting-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="allowRegistrations"
                  checked={settings.allowRegistrations}
                  onChange={handleInputChange}
                />
                <span>Allow New Registrations</span>
                <small>Allow new users to sign up</small>
              </label>
            </div>
            <div className="setting-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="enableNotifications"
                  checked={settings.enableNotifications}
                  onChange={handleInputChange}
                />
                <span>Enable Email Notifications</span>
                <small>Send email notifications to users</small>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="settings-section">
          <h2><FaPalette /> Appearance</h2>
          <div className="settings-grid">
            <div className="setting-group">
              <label>Primary Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  name="primaryColor"
                  value={settings.primaryColor}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="primaryColor"
                  value={settings.primaryColor}
                  onChange={handleInputChange}
                  placeholder="#667eea"
                />
              </div>
            </div>
            <div className="setting-group">
              <label>Secondary Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  name="secondaryColor"
                  value={settings.secondaryColor}
                  onChange={handleInputChange}
                />
                <input
                  type="text"
                  name="secondaryColor"
                  value={settings.secondaryColor}
                  onChange={handleInputChange}
                  placeholder="#764ba2"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="settings-actions">
          <button type="button" className="reset-btn" onClick={resetToDefaults}>
            Reset to Defaults
          </button>
          <button type="submit" className="save-btn">
            <FaSave /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}

export default Settings;