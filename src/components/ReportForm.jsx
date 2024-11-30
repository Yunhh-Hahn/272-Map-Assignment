import "./ReportForm.css";
import { useState } from "react";
import propTypes from "prop-types";

function ReportForm({ tempAddress, onSubmit, onClose }) {
  // temp.display_name is a preformatted string, we need to extract the address name from it
  // Priority -> place name -> building num -> street name -> city
  let lowerBound = 0;
  let higherBound = 2;
  let placeName = tempAddress.name;

  if (tempAddress.name !== "") {
    if (tempAddress.addresstype === "road") {
      lowerBound = 0;
      higherBound = 3;
      placeName = "";
    } else {
      lowerBound = 1;
      higherBound = 4;
    }
  }
  // Extract the address name from the response data, data.display_name is a preformatted string, faster to split preformatted string then format string ourselves via data.address
  // Split the string by commas, and join the parts we want
  const addressName = tempAddress.display_name
    .split(",")
    .slice(lowerBound, higherBound)
    .join(",");

  const [formData, setFormData] = useState({
    reporterName: "",
    reporterPhone: "",
    emergencyType: "",
    address: addressName ? addressName : "",
    placeName: placeName,
    pictureUrl: "",
    comments: "",
    geo: {
      lat: tempAddress.lat,
      lng: tempAddress.lon,
    },
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
    console.log("tempAddress:", tempAddress); 
    console.log("formData:", formData); 

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
          <div id="buttons">
            <button type="submit">Submit Report</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ReportForm.propTypes = {
  tempAddress: propTypes.object,
  onSubmit: propTypes.func.isRequired,
  onClose: propTypes.func.isRequired,
};

export default ReportForm;
