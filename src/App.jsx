// App.jsx

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
    const mapInstance = mapRef.current; 
    if (!mapInstance) return;

    updateVisibleReports();
    mapInstance.on("moveend", updateVisibleReports);
    mapInstance.on("zoomend", updateVisibleReports);

    return () => {
      mapInstance.off("moveend", updateVisibleReports);
      mapInstance.off("zoomend", updateVisibleReports);
    };
  }, [reports]);

  
  // Update handleMapClick to perform reverse geocoding
  const handleMapClick = async (markerPoint) => {
    setTempMarkerPoint(markerPoint);

    // Perform reverse geocoding to get the address
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${markerPoint.lat}&lon=${markerPoint.lng}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setTempAddress(data); // Store the address data
    } catch (error) {
      console.error("Error fetching address:", error);
      setTempAddress({});
    }

    setShowForm(true);
  };




  const handleModifyReport = (modifiedReport) => {
    if (modifiedReport.delete) {
      // Handle deletion
      setReports((prevReports) =>
        prevReports.filter((report) => report.id !== modifiedReport.id)
      );
    } else {
      // Handle modification
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === modifiedReport.id ? modifiedReport : report
        )
      );
    }
  };

// App.jsx

const handleFormSubmit = (formData, updatedMarkerPoint = null) => {
  const markerPointToUse = updatedMarkerPoint || tempMarkerPoint;

  const newReport = {
    id: reports.length ? reports[reports.length - 1].id + 1 : 1,
    geocode: {
      lng: markerPointToUse.lng,
      lat: markerPointToUse.lat,
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
          tempAddress={tempAddress} // Pass tempAddress here
          onClose={() => {
            setShowForm(false);
            setTempMarkerPoint(null);
          }}
        />
      )}



      <div id="table">
      {/* ReportTable Component */}
      {/* This component is used to display a table view of the reports that are visible on the map */}
      {/* It also allows sorting, selecting, modifying, and resolving reports */}
      <ReportTable
        reports={visibleReports} // Pass the reports that are visible in the current map bounds
        focusedID={focusedID} // Pass the currently focused report ID to highlight it
        onReportSelect={(id) => {
          // Handle report selection (e.g., center the map on the selected report)
          setFocusedID(id);
          const report = reports.find((r) => r.id === id);
          if (report) {
            mapRef.current.flyTo([report.geocode.lat, report.geocode.lng], 15);
          }
        }}
        onResolve={handleResolve} // Pass the function to resolve reports
        onModify={handleModifyReport} // Pass the function to handle report modification
      />
      </div>

      <button className="z-[10000] fixed p-2" onClick={clearReports}>
        Clear Reports
      </button>
    </div>


          


  );
}

export default App;
