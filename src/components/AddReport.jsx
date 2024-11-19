// AddReport.jsx
import { useMapEvents } from 'react-leaflet';
import propTypes from 'prop-types';

function AddReport({ onMapClick }) {
  useMapEvents({
    click: async (e) => {
      const markerPoint = e.latlng;
      // look up address via geocode via api
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${markerPoint.lat}&lon=${markerPoint.lng}&format=json`;
      
      try {
        const response = await fetch(url);
        const data = await response.json();
        
        let higherBound = 2;
        // if user clicks on a house, increase limit to 3
        if(data.address.house_number != undefined) {
          higherBound = 3;
        }

        // Extract the address name from the response data, data.display_name is a preformatted string, faster to split preformatted string then format string ourselves via data.address, format ourselves if needed
        const addressName = data.display_name.split(',').slice(0, higherBound).join(',');
        onMapClick(markerPoint, addressName);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }

    },
  });

  return null;
}

AddReport.propTypes = {
  onMapClick: propTypes.func.isRequired,
};

export default AddReport;
