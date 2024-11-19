import { Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import pinFocus from './assets/pin-focus.png';
import pinDefault from './assets/pin.png';
import propTypes from 'prop-types';

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
 * @param {object[]} reportArray - An array of report objects.
 * @param {number} focusedID - The id of the report to be highlighted.
 * @param {function} onClick - Function to handle marker click.
 * @param {function} onResolve - Function to handle report resolution.
 * @returns {JSX.Element[]}
 */
const DrawReports = ({ reportArray, focusedID, onClick, onResolve }) => {
  return (
    <>
      {reportArray &&
        reportArray.map((report) => (
          <Marker
            position={[report.geocode.lat, report.geocode.lng]}
            icon={report.id === focusedID ? focusedIcon : defaultIcon}
            key={report.id}
            eventHandlers={{
              click: () => {
                onClick(report.id);
              },
            }}
          >
            <Popup>
              <div>
                <h3>{report.emergencyType}</h3>
                <p>
                  <strong>Reported by:</strong> {report.reporterName}
                </p>
                <p>
                  <strong>Phone:</strong> {report.reporterPhone}
                </p>
                <p>
                  <strong>Location:</strong> {report.address || 'N/A'}
                </p>
                <p>
                  <strong>Comments:</strong> {report.comments}
                </p>
                <p>
                  <strong>Status:</strong> {report.status}
                </p>
                <p>
                  <strong>Time/Date:</strong>{' '}
                  {new Date(report.timestamp).toLocaleString()}
                </p>
                {report.pictureUrl && (
                  <p>
                    <a href={report.pictureUrl} target="_blank" rel="noreferrer">
                      View Image
                    </a>
                  </p>
                )}
                {/* Only show the Resolve button if status is OPEN */}
                {report.status === 'OPEN' && (
                  <button onClick={() => onResolve(report.id)}>
                    Resolve
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
    </>
  );
};

DrawReports.propTypes = {
  reportArray: propTypes.array.isRequired,
  focusedID: propTypes.number,
  onClick: propTypes.func.isRequired,
  onResolve: propTypes.func.isRequired,
};

export default DrawReports;
