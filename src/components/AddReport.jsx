// AddReport.jsx
import { useMapEvents } from "react-leaflet";
import propTypes from "prop-types";

function AddReport({ onMapClick }) {
  useMapEvents({
    click: async (e) => {
      const markerPoint = e.latlng;
      // look up address via geocode via api
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${markerPoint.lat}&lon=${markerPoint.lng}&format=json`;

      try {
        const response = await fetch(url);
        const data = await response.json();
        onMapClick(markerPoint, data);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    },
  });

  return null;
}

AddReport.propTypes = {
  onMapClick: propTypes.func.isRequired,
};

export default AddReport;
