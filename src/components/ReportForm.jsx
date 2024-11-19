
import './ReportForm.css';
import { useState } from 'react';
import propTypes from 'prop-types';

function ReportForm({ markerPoint, displayName, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    reporterName: "",
    reporterPhone: "",
    emergencyType: "",
    address: displayName ? displayName : "",
    placeName: "",
    pictureUrl: "",
    comments: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Simple validation function
  const isValidForm = () => {
    return (
      formData.reporterName &&
      /^\d{10}$/.test(formData.reporterPhone) &&
      formData.emergencyType
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidForm()) {
      onSubmit(formData);
    } else {
      alert("Please fill in all required fields correctly.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Submit Emergency Report</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Your Name*:
            <input
              type="text"
              name="reporterName"
              value={formData.reporterName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Your Phone Number*:
            <input
              type="tel"
              name="reporterPhone"
              value={formData.reporterPhone}
              onChange={handleChange}
              required
            />
            {!/^\d{10}$/.test(formData.reporterPhone) &&
              formData.reporterPhone && (
                <span className="error">
                  Enter a valid 10-digit phone number.
                </span>
              )}
          </label>
          <label>
            Nature of Emergency*:
            <input
              type="text"
              name="emergencyType"
              value={formData.emergencyType}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </label>
          <label>
            Place Name:
            <input
              type="text"
              name="placeName"
              value={formData.placeName}
              onChange={handleChange}
            />
          </label>
          <label>
            Picture URL:
            <input
              type="url"
              name="pictureUrl"
              value={formData.pictureUrl}
              onChange={handleChange}
            />
          </label>
          <label>
            Comments:
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
            />
          </label>
          <p>Fields marked with * are required.</p>
          <button type="submit">Submit Report</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

ReportForm.propTypes = {
  markerPoint: propTypes.object,
  displayName: propTypes.string,
  onSubmit: propTypes.func.isRequired,
  onClose: propTypes.func.isRequired,
};

export default ReportForm;
