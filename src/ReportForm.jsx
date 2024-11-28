// ReportForm.jsx

import React, { useState } from 'react';

function ReportForm({ markerPoint, onSubmit, tempAddress, onClose }) {
  const [formData, setFormData] = useState({
    reporterName: '',
    reporterPhone: '',
    emergencyType: '',
    address: tempAddress.display_name || '',
    placeName: '',
    pictureUrl: '',
    comments: '',
  });

  const [suggestions, setSuggestions] = useState([]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If the address field is changing, fetch suggestions
    if (name === 'address') {
      if (value.length >= 3) {
        fetchAddressSuggestions(value);
      } else {
        setSuggestions([]);
      }
    }
  };

  // Fetch address suggestions from Nominatim API
  const fetchAddressSuggestions = async (query) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(query)}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching address suggestions:', error);
    }
  };

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion) => {
    setFormData({ ...formData, address: suggestion.display_name });
    setSuggestions([]);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Perform validation
    if (!formData.reporterName || !formData.reporterPhone || !formData.emergencyType || !formData.address) {
      alert('Please fill in all required fields.');
      return;
    }

    // Validate phone number format (e.g., (604) 123 4567)
    const phonePattern = /^\(\d{3}\) \d{3} \d{4}$/;
    if (!phonePattern.test(formData.reporterPhone)) {
      alert('Please enter a valid phone number in the format (604) 123 4567.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <div className="report-form">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="reporterName">Name:</label>
          <input
            type="text"
            name="reporterName"
            id="reporterName"
            value={formData.reporterName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="reporterPhone">Phone Number:</label>
          <input
            type="text"
            name="reporterPhone"
            id="reporterPhone"
            value={formData.reporterPhone}
            onChange={handleChange}
            placeholder="(604) 123 4567"
          />
        </div>
        <div>
          <label htmlFor="emergencyType">Emergency Type:</label>
          <select
            name="emergencyType"
            id="emergencyType"
            value={formData.emergencyType}
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            <option value="Fire">Fire</option>
            <option value="Shooting">Shooting</option>
            <option value="Vehicle Accident">Vehicle Accident</option>
            <option value="Medical">Medical</option>
            {/* Add other options as needed */}
          </select>
        </div>
        <div style={{ position: 'relative' }}>
          <label htmlFor="address">Address:</label>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={handleChange}
            autoComplete="off"
          />
          {/* Suggestions Dropdown */}
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Additional form fields */}
        <div>
          <label htmlFor="pictureUrl">Picture URL:</label>
          <input
            type="text"
            name="pictureUrl"
            id="pictureUrl"
            value={formData.pictureUrl}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="comments">Comments:</label>
          <textarea
            name="comments"
            id="comments"
            value={formData.comments}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit">Submit Report</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default ReportForm;
