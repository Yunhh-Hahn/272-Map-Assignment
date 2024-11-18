import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import pinFocus from "./assets/pin-focus.png";
import pinDefault from "./assets/pin.png";
import proptypes from "prop-types";



const defaultIcon = new Icon({
  iconUrl: pinDefault,
  iconSize: [38, 38],
});

const focusedIcon = new Icon({
  iconUrl: pinFocus,
  iconSize: [38, 38],
});

/**
 * Draws a collection of reports on the map as markers with popups.
 * If a report.id matches the focusedID, the marker is highlighted.
 *
 * @param {object[]} reportArray - An array of report objects, each containing a geocode and an id. Ideally, fetch this array from the dom storage API
 * @param {number} focusedID - The id of the report to be highlighted.
 * @returns {JSX.Element[]}
 */
const DrawReports = ({ reportArray, focusedID, onClick }) => {
  return (
    <>
      {reportArray.length > 1 &&
        reportArray.map((report) => (
          <Marker
            position={report.geocode}
            icon={report.id === focusedID ? focusedIcon : defaultIcon}
            key={report.id}
            eventHandlers={{
              click: () => {
                onClick(report.id);
              },
            }}
          >
            <Popup>
              {/*TODO: add in the report details, format it. Along with a button to modify the report*/}
              Hello world
            </Popup>
          </Marker>
        ))}
    </>
  );
};

DrawReports.propTypes = {
  reportArray: proptypes.array,
  focusedID: proptypes.number,
  onClick: proptypes.func,
};

export default DrawReports;
