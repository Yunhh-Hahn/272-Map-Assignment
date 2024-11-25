import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import pinFocus from "../assets/pin-focus.png";
import pinDefault from "../assets/pin.png";
import propTypes from "prop-types";

const defaultIcon = new Icon({
  iconUrl: pinDefault,
  iconSize: [38, 38],
});

const focusedIcon = new Icon({
  iconUrl: pinFocus,
  iconSize: [38, 38],
});

function DrawReports({ reportArray, focusedID, onClick, onResolve }) {
  return (
    <>
      {reportArray &&
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
              <div>
                <h3>{report.emergencyType}</h3>
                <p>
                  <strong>Reported by:</strong> {report.reporterName}
                </p>
                <p>
                  <strong>Phone:</strong> {report.reporterPhone}
                </p>
                <p>
                  <strong>Location:</strong> {report.address || "N/A"}
                </p>
                <p>
                  <strong>Comments:</strong> {report.comments}
                </p>
                <p>
                  <strong>Status:</strong> {report.status}
                </p>
                <p>
                  <strong>Time/Date:</strong>{" "}
                  {new Date(report.timestamp).toLocaleString()}
                </p>
                {report.pictureUrl && (
                  <p>
                    <a
                      href={report.pictureUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Image
                    </a>
                  </p>
                )}
                {report.status === "OPEN" && (
                  <button onClick={() => onResolve(report.id)}>Resolve</button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
    </>
  );
}

DrawReports.propTypes = {
  reportArray: propTypes.array.isRequired,
  focusedID: propTypes.number,
  onClick: propTypes.func.isRequired,
  onResolve: propTypes.func.isRequired,
};

export default DrawReports;
