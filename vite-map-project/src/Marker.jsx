import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet"; 
 

const defaultIcon = new Icon({
    iconUrl: "assets/pin.png",
    iconSize: [38, 38]
  })

const drawMarkers = (markerArray) => {
    return (
      markerArray.map((marker, index) => (
        <Marker position={marker.geocode} icon={defaultIcon} key={index}>
          <Popup>
            {/*add it form component here*/}
            Hello world
          </Popup>
        </Marker>
      ))
    );
  }

export default drawMarkers