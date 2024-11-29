import { useState, useEffect } from "react";
import propTypes from "prop-types";
import { SECRET_PASSWORD } from "../lib/constants";
import md5 from "md5";

function ReportList({
  reports,
  map,
  onReportSelect,
  onUpdateReport,
  onDeleteReport,
}) {
  const [visibleReports, setVisibleReports] = useState([]);
  const [sortKey, setSortKey] = useState("timestamp"); // Default sort by time/date
  const [selectedReportId, setSelectedReportId] = useState(null); // To track selected report

  // Filter reports based on map bounds
  useEffect(() => {
    const updateVisibleReports = () => {
      const bounds = map.getBounds();
      const visible = reports.filter((report) =>
        bounds.contains([report.geocode.lat, report.geocode.lng])
      );
      setVisibleReports(visible);
    };

    updateVisibleReports();
    map.on("moveend", updateVisibleReports);
    map.on("zoomend", updateVisibleReports);

    return () => {
      map.off("moveend", updateVisibleReports);
      map.off("zoomend", updateVisibleReports);
    };
  }, [map, reports]);

  // Sort reports
  const sortedReports = [...visibleReports].sort((a, b) => {
    if (sortKey === "location") {
      return a.address.localeCompare(b.address);
    } else if (sortKey === "emergencyType") {
      return a.emergencyType.localeCompare(b.emergencyType);
    } else if (sortKey === "status") {
      return a.status.localeCompare(b.status);
    } else {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
  });

  // Handle modify/delete with passcode prompt
  const handlePasscodeAction = (action, report) => {
    const userPasscode = prompt("Enter passcode:");
    if (md5(userPasscode) === SECRET_PASSWORD) {
      if (action === "modify") {
        onUpdateReport(report);
      } else if (action === "delete") {
        onDeleteReport(report.id);
      }
    } else {
      alert("Incorrect passcode.");
    }
  };

  // Handle report selection and update marker color
  const handleReportSelect = (reportId) => {
    setSelectedReportId(reportId); // Set selected report
    onReportSelect(reportId); // Trigger additional logic (e.g., show details)
  };

  return (
    <div className="report-list p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Emergency Reports</h2>
      <div className="mb-4">
        <label className="mr-2">Sort by: </label>
        <select
          className="border p-2 rounded"
          onChange={(e) => setSortKey(e.target.value)}
          value={sortKey}
        >
          <option value="timestamp">Time Reported</option>
          <option value="location">Location</option>
          <option value="emergencyType">Emergency Type</option>
          <option value="status">Status</option>
        </select>
      </div>
      <ul className="space-y-2">
        {sortedReports.map((report) => (
          <li
            key={report.id}
            className={`p-4 rounded-lg shadow flex justify-between items-center ${
              report.id === selectedReportId ? "bg-red-200" : "bg-white"
            }`}
          >
            <div onClick={() => handleReportSelect(report.id)}>
              <strong className="block text-lg">{report.emergencyType}</strong>
              <span className="text-sm text-gray-600">
                {report.address || "Unknown location"}
              </span>
              <span className="block text-sm">Status: {report.status}</span>
              <a
                href={`#`}
                onClick={(e) => {
                  e.preventDefault();
                  alert(report.comments || "No comments available.");
                }}
                className="text-blue-500 hover:underline text-sm"
              >
                More Info
              </a>
            </div>
            <div className="flex space-x-2">
              <button
                className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                onClick={() => handlePasscodeAction("modify", report)}
              >
                Modify
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                onClick={() => handlePasscodeAction("delete", report)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

ReportList.propTypes = {
  reports: propTypes.array.isRequired,
  map: propTypes.object.isRequired,
  onReportSelect: propTypes.func.isRequired,
  onUpdateReport: propTypes.func.isRequired,
  onDeleteReport: propTypes.func.isRequired,
};

export default ReportList;
