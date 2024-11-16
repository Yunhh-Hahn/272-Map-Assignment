import { MapContainer, TileLayer, useMapEvents, useMap, Marker, Popup} from "react-leaflet";
import { useState } from "react";
import { Icon } from "leaflet";
import './App.css'
import drawReports from "./drawReports.jsx";
import pinFocus from "./assets/pin-focus.png";

const focusedIcon = new Icon({
  iconUrl: pinFocus,
  iconSize: [38, 38]
})

// This is a React component that uses react-leaflet to handle
// a user's click on the map. It adds a marker and opens a popup in the map at the
// point of the click.
function AddReport() {
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

      // Immediately open a popup with a message at the location of the marker.
      // Either include a button to take user to the form or directly open the form in the popup
      map.openPopup("<h1>hello world</h1>", markerPoint);
    }
  });

  // The component renders either nothing (if there is no marker) or a
  // marker at the location of the marker.
  return (
    <>
    {markerPoint ? 
      <Marker position={markerPoint} icon={focusedIcon}/> 
    : null}
    </>)
}

function App() {
  return (
    <>
    <MapContainer center={[49.259065, -122.917980]} zoom={13} className='h-screen w-screen z-0' maxBounds={[[48.2, -121.8], [50.499998, -125.6833]]} minZoom={10} maxZoom={18}>
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <AddReport/>
    </MapContainer>
    </>
  )
}

export default App
