import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet"; 
 

const defaultIcon = new Icon({
    iconUrl: "assets/pin.png",
    iconSize: [38, 38]
  })

const focusedIcon = new Icon({
    iconUrl: "assets/pin-focus.png",
    iconSize: [38, 38]
  })

const drawReports = (reportArray, focusedID) => {
    return (
      reportArray.map((report, index) => (
        <Marker position={report.geocode} icon={report.id === focusedID ? focusedIcon:defaultIcon} key={index}>
          <Popup>
            {/*add in form component here*/}
            Hello world
          </Popup>
        </Marker>
      ))
    );
  }

export default drawReports