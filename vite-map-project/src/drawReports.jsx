import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet"; 
import pinFocus from "./assets/pin-focus.png";
import pinDefault from "./assets/pin.png";
 

const defaultIcon = new Icon({
    iconUrl: pinDefault,
    iconSize: [38, 38]
  })

const focusedIcon = new Icon({
    iconUrl: pinFocus,
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