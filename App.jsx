// App.jsx

import { MapContainer, TileLayer } from 'react-leaflet';
import { useState, useEffect } from 'react';
import './App.css';
import DrawReports from './drawReports.jsx';
import ReportForm from './ReportForm.jsx';
import AddReport from './AddReport.jsx';
import ReportList from './ReportList.jsx';
import md5 from 'md5';

// Passcode here--------------------------------------------------
const PASSCODE_HASH = md5('MuMeLeLe');

function App() {
  // State to store all reports, initialized from localStorage
  const [reports, setReports] = useState(() => {
    const savedReports = localStorage.getItem('reports');
    return savedReports ? JSON.parse(savedReports) : [];
  });

  // State to keep track of the currently focused report ID
  const [focusedID, setFocusedID] = useState(0);

  // State to control the display of the report submission form
  const [showForm, setShowForm] = useState(false);

  // State to temporarily store the marker point where the user clicked
  const [tempMarkerPoint, setTempMarkerPoint] = useState(null);

  // State to store the map instance for future reference
  const [mapInstance, setMapInstance] = useState(null);

  // Effect to save reports to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('reports', JSON.stringify(reports));
  }, [reports]);

  // Function to handle clicks on the map and display the report form
  const handleMapClick = (markerPoint) => {
    setTempMarkerPoint(markerPoint);
    setShowForm(true);
  };

  // Function to handle form submission and add a new report
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
      status: 'OPEN',
    };
    setReports((prevReports) => [...prevReports, newReport]);
    setFocusedID(newReport.id);
    setTempMarkerPoint(null);
    setShowForm(false);
  };

  // Function to handle resolving a report with passcode verification
  const handleResolve = (reportId) => {
    const userPasscode = prompt('Enter passcode to resolve this report:');
    if (md5(userPasscode) === PASSCODE_HASH) {
      setReports((prevReports) =>
        prevReports.map((report) =>
          report.id === reportId ? { ...report, status: 'RESOLVED' } : report
        )
      );
      alert('Report status updated to RESOLVED.');
    } else {
      alert('Incorrect passcode.');
    }
  };

  // Function to clear all reports
  const clearReports = () => {
    setReports([]);
  };

  return (
    <>
      {/* Map Container */}
      <MapContainer
        center={[49.259065, -122.91798]}
        zoom={13}
        className="h-screen w-screen z-0"
        maxBounds={[
          [48.2, -121.8],
          [50.499998, -125.6833],
        ]}
        minZoom={10}
        maxZoom={18}
        whenCreated={(map) => setMapInstance(map)} // Store map instance
      >
        {/* Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">
            OpenStreetMap
          </a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Component to handle map clicks */}
        <AddReport onMapClick={handleMapClick} />
        {/* Component to draw reports on the map */}
        <DrawReports
          reportArray={reports}
          focusedID={focusedID}
          onClick={(id) => setFocusedID(id)}
          onResolve={handleResolve}
        />
      </MapContainer>

      {/* Conditionally render the Report Form */}
      {showForm && (
        <ReportForm
          markerPoint={tempMarkerPoint}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setTempMarkerPoint(null);
          }}
        />
      )}

      {/* Conditionally render the Report List */}
      {mapInstance && (
        <ReportList
          reports={reports}
          map={mapInstance}
          onReportSelect={(id) => setFocusedID(id)}
        />
      )}

      {/* Button to clear all reports (for testing purposes) */}
      <button className="z-[10000] fixed p-2" onClick={clearReports}>
        Clear Reports
      </button>
    </>
  );
}

export default App;
