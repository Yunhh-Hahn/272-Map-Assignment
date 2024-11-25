import { MapContainer, TileLayer } from "react-leaflet";
import { useState, useEffect, useRef } from "react";
import "./App.css";
import DrawReports from "./components/DrawReports.jsx";
import ReportForm from "./components/ReportForm.jsx";
import AddReport from "./components/AddReport.jsx";
import ReportTable from "./components/ReportTable.jsx";
import md5 from "md5";

// Passcode here--------------------------------------------------
const PASSCODE_HASH = md5("MuMeLeLe");

function App() {
  const [reports, setReports] = useState(() => {
    const savedReports = localStorage.getItem("reports");
    return savedReports ? JSON.parse(savedReports) : [];
  });

  const [visibleReports, setVisibleReports] = useState([]);
  const [focusedID, setFocusedID] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [tempMarkerPoint, setTempMarkerPoint] = useState(null);
  const [tempAddress, setTempAddress] = useState({});
  const mapRef = useRef(null); // use ref!!!!!

  useEffect(() => {
    localStorage.setItem("reports", JSON.stringify(reports));
  }, [reports]);

  const updateVisibleReports = () => {
    const mapInstance = mapRef.current;
    if (!mapInstance) return;

    const bounds = mapInstance.getBounds();
    const visible = reports.filter((report) => {
      const { lat, lng } = report.geocode || {};
      return lat != null && lng != null && bounds.contains([lat, lng]);
    });

    console.log("Updated visible reports based on bounds:", visible); // for debugging ok to be deleted
    setVisibleReports(visible);
  };

  useEffect(() => {
    const checkMapInstance = () => {
      const mapInstance = mapRef.current;
      if (!mapInstance) return;
      updateVisibleReports();

      mapInstance.on("moveend", updateVisibleReports);
      mapInstance.on("zoomend", updateVisibleReports);

      return () => {
        mapInstance.off("moveend", updateVisibleReports);
        mapInstance.off("zoomend", updateVisibleReports);
      };
    };

    // Check if mapRef.current is available, rerun until map mounts
    const interval = setInterval(() => {
      if (mapRef.current) {
        clearInterval(interval);
        checkMapInstance();
      }
    }, 50);

    return () => clearInterval(interval); // remove when map is mounted
  }, [mapRef, reports]);

  const handleMapClick = (markerPoint, data) => {
    setTempMarkerPoint(markerPoint);
    setTempAddress(data);
    setShowForm(true);
  };

  const handleFormSubmit = (formData) => {
    const newReport = {
      id: reports.length ? reports[reports.length - 1].id + 1 : 1,
      geocode: {
        lng: tempMarkerPoint.lng,
        lat: tempMarkerPoint.lat,
      },
      reporterName: formData.reporterName,
      reporterPhone: formData.reporterPhone,
      emergencyType: formData.emergencyType,
      address: formData.address,
      placeName: formData.placeName,
      pictureUrl: formData.pictureUrl,
      comments: formData.comments,
      timestamp: new Date().toISOString(),
      status: "OPEN",
    };
    setReports((prevReports) => [...prevReports, newReport]);
    setFocusedID(newReport.id);
    setTempMarkerPoint(null);
    setShowForm(false);

    updateVisibleReports();
  };

  const handleResolve = (reportId) => {
    const userPasscode = prompt("Enter passcode to resolve this report:");
    if (md5(userPasscode) === PASSCODE_HASH) {
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId ? { ...report, status: "RESOLVED" } : report
        )
      );
      alert("Report status updated to RESOLVED.");
    } else {
      alert("Incorrect passcode.");
    }
  };

  const clearReports = () => {
    setReports([]);
  };

  return (
    <div id="container">
      <div id="map">
        <MapContainer
          center={[49.259065, -122.91798]}
          zoom={13}
          className="h-full w-full"
          maxBounds={[
            [48.2, -121.8],
            [50.499998, -125.6833],
          ]}
          minZoom={10}
          maxZoom={18}
          ref={mapRef}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <AddReport onMapClick={handleMapClick} />
          <DrawReports
            reportArray={reports}
            focusedID={focusedID}
            onClick={(id) => setFocusedID(id)}
            onResolve={handleResolve}
          />
        </MapContainer>
      </div>

      {showForm && (
        <ReportForm
          markerPoint={tempMarkerPoint}
          onSubmit={handleFormSubmit}
          tempAddress={tempAddress}
          onClose={() => {
            setShowForm(false);
            setTempMarkerPoint(null);
          }}
        />
      )}

      <div id="table">
          <ReportTable
          reports={visibleReports}
          focusedID={focusedID} 
          onReportSelect={(id) => {
            setFocusedID(id); 
            const report = reports.find((r) => r.id === id);
            if (report) {
              mapRef.current.flyTo([report.geocode.lat, report.geocode.lng], 15); // move the map to the selected report if not wanted, delete this part
            }
          }}
          onResolve={handleResolve}
        />
      </div>

      <button className="z-[10000] fixed p-2" onClick={clearReports}>
        Clear Reports
      </button>
    </div>
  );
}

export default App;
