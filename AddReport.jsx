// AddReport.jsx
import { useMapEvents } from 'react-leaflet';
import propTypes from 'prop-types';

function AddReport({ onMapClick }) {
  useMapEvents({
    click: (e) => {
      const markerPoint = e.latlng;
      onMapClick(markerPoint);
    },
  });

  return null;
}

AddReport.propTypes = {
  onMapClick: propTypes.func.isRequired,
};

export default AddReport;
