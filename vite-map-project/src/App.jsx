import { MapContainer, TileLayer, useMapEvents, useMap, Marker } from "react-leaflet";
import { useState, useEffect } from "react";
import { Icon } from "leaflet";
import './App.css'
import DrawReports from "./drawReports.jsx";
import pinFocus from "./assets/pin-focus.png";
import propTypes from "prop-types";

const focusedIcon = new Icon({
  iconUrl: pinFocus,
  iconSize: [38, 38]
})

/**
 * A React component that listens for a click event on the map. When a click
 * is detected, it converts the pixel coordinates of the click to latitude and
 * longitude coordinates and sets the markerPoint state to those coordinates.
 * Immediately after, it opens a popup with a message at the location of the
 * marker. Finally, it renders either nothing (if there is no marker) or a
 * marker at the location of the marker.
 * 
 * @returns {JSX.Element} A React component containing either nothing or a
 *                        marker.
*/
function AddReport({ sendMarker }) {
  const map = useMap(); // This hook gets the map object from the MapContainer
  const [markerPoint, setMarkerPoint] = useState(null);
  
  // This hook is a react-leaflet hook that listens for an event (in this case,
  // a click).
  useMapEvents({
    click: (e) => {
      // Get the coordinates of the click in pixels relative to the map container.
      let pixelCor = map.mouseEventToContainerPoint(e.originalEvent);
      // Convert the pixel coordinates to latitude and longitude coordinates.
      let markerPoint = map.containerPointToLatLng(pixelCor);
      setMarkerPoint(markerPoint);
      sendMarker(markerPoint);
      // Immediately open a popup with a message at the location of the marker.
      // TODO: Either include a button to take user to the form or directly open the form in the popup
      map.openPopup("<h1>hello world</h1>", markerPoint);
    },
  });
  
  // The component renders either nothing (if there is no marker) or a
  // marker at the location of the marker.
  return (
    <>
      {markerPoint ? (
        <Marker position={markerPoint} icon={focusedIcon} />
      ) : null}
    </>
  );
}

AddReport.propTypes = {
  sendMarker: propTypes.func,
};

function App() {
  
  // useState and load reports from localStorage, if they exist, otherwise, initialize as empty array
  const [reports, setReports] = useState(() => {
    const savedReports = localStorage.getItem("reports");
    return savedReports ? JSON.parse(savedReports) : [];
  });

  const [focusedID, setFocusedID] = useState(0);

  // useEffect to watch reports state for any changes and save to LocalStorage new changes
  useEffect(() => {
    localStorage.setItem("reports", JSON.stringify(reports));
  }, [reports]);

  // Function to add a report to the reports array s
  const handleAddReport = (markerPoint) => {
    const newReport = {
      geocode: {
        lng: markerPoint.lng,
        lat: markerPoint.lat,
      },
      id: reports.length ? reports[reports.length - 1].id + 1 : 1,
      // TODO INPUT, DESCRIPTION, TITLE, ETC FROM FORM
    };
    setFocusedID(newReport.id);
    setReports((prevReports) => [...prevReports, newReport]);
  };

  // Function to clear all reports from the reports state and LocalStorage is cleared because of useEffect hook
  const clearReports = () => {
    setReports([]);
  };

  return (
    <>
      <MapContainer center={[49.259065, -122.917980]} zoom={13} className='h-screen w-screen z-0' maxBounds={[[48.2, -121.8], [50.499998, -125.6833]]} minZoom={10} maxZoom={18}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <AddReport sendMarker={handleAddReport} />
        <DrawReports
          reportArray={reports}
          focusedID={focusedID}
          onClick={(id) => {
            setFocusedID(id);
          }}
        />
        <button className="z-[10000] fixed p-2 " onClick={clearReports}>Clear Reports</button>{/* TEST CLEAR BUTTON */}
      </MapContainer>
    </>
  );
}

export default App
