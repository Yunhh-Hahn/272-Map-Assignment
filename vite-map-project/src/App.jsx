import { MapContainer, TileLayer, useMapEvents, useMap, Marker, Popup} from "react-leaflet";
import { useState } from "react";
import { Icon } from "leaflet";
import './App.css'
import drawReports from "./drawReports.jsx";

function MyComponent() {
  const map = useMap();
  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/447/447031.png",
    iconSize: [38, 38]
  })

  const [markerPoint, setMarkerPoint] = useState(null);
  useMapEvents({
    click: (e) => {
      let pixelCor = map.mouseEventToContainerPoint(e.originalEvent);
      let markerPoint = map.containerPointToLatLng(pixelCor);
      setMarkerPoint(markerPoint)

    }
  });

  return markerPoint ? (
    <Marker position={markerPoint} icon={customIcon}> 
      <Popup>
        Hello world
      </Popup>
    </Marker>
  ) : null;
}





function App() {

  return (
    <>
    <MapContainer center={[49.259065, -122.917980]} zoom={13} className='h-screen w-screen z-0' maxBounds={[[48.2, -121.8], [50.499998, -125.6833]]} minZoom={10} maxZoom={18}>
      <TileLayer 
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MyComponent />
    </MapContainer>
    </>
  )
}

export default App
