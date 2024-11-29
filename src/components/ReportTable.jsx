// ReportTable.jsx

import { useState, useEffect } from "react";
import propTypes from "prop-types";
import { SECRET_PASSWORD } from "../lib/constants";
import md5 from "md5";

function ReportTable({
  reports,
  focusedID,
  onReportSelect,
  onResolve,
  onModify,
}) {
  const [sortKey, setSortKey] = useState("id"); // Default sort by ID
  const [sortOrder, setSortOrder] = useState("asc"); // Ascending order by default
  const [selectedReport, setSelectedReport] = useState(null); // For detailed view
  const [modalContent, setModalContent] = useState(null); // For comments-only modal
  const [isModifying, setIsModifying] = useState(false); // To track if modification is allowed
  const [modifyingReport, setModifyingReport] = useState(null); // Report being modified

  const [addressSuggestions, setAddressSuggestions] = useState([]);

  // Effect to reset selectedReport if it's no longer in the reports list
  useEffect(() => {
    if (
      selectedReport &&
      !reports.some((report) => report.id === selectedReport.id)
    ) {
      setSelectedReport(null);
    }
  }, [reports, selectedReport]);

  // Function to sort reports
  const sortedReports = [...reports].sort((a, b) => {
    let comparison = 0;

    if (sortKey === "emergencyType") {
      comparison = a.emergencyType.localeCompare(b.emergencyType);
    } else if (sortKey === "reporterName") {
      comparison = a.reporterName.localeCompare(b.reporterName);
    } else if (sortKey === "address") {
      comparison = (a.address || "").localeCompare(b.address || "");
    } else if (sortKey === "status") {
      comparison = a.status.localeCompare(b.status);
    } else if (sortKey === "timestamp") {
      comparison = new Date(a.timestamp) - new Date(b.timestamp);
    } else {
      comparison = a.id - b.id; // Default sorting by ID
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  // Handle Modify button click
  const handleModifyClick = (report) => {
    const userPasscode = prompt("Enter passcode to modify this report:");
    if (md5(userPasscode) === SECRET_PASSWORD) {
      setIsModifying(true);
      setModifyingReport(report);
    } else {
      alert("Incorrect passcode.");
    }
  };

  // Handle form input changes during modification
  const handleModifyChange = (e) => {
    const { name, value } = e.target;
    setModifyingReport({ ...modifyingReport, [name]: value });
  };

  // Handle saving the modifications
  const handleSaveModification = async () => {
    let updatedReport = { ...modifyingReport };

    // Check if geocode is missing or needs updating
    if (
      !updatedReport.geocode ||
      !updatedReport.geocode.lat ||
      !updatedReport.geocode.lng
    ) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            updatedReport.address
          )}&format=json&limit=1`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          updatedReport.geocode = {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          };
        } else {
          alert("Unable to geocode the provided address.");
          return;
        }
      } catch (error) {
        console.error("Error fetching geocode data:", error);
        alert("An error occurred while fetching geocode data.");
        return;
      }
    }

    // Validate geocode data
    if (
      updatedReport.geocode.lat < -90 ||
      updatedReport.geocode.lat > 90 ||
      updatedReport.geocode.lng < -180 ||
      updatedReport.geocode.lng > 180
    ) {
      alert("Geocode data is invalid. Please check the address.");
      return;
    }

    // Save the modification
    onModify(updatedReport);
    setIsModifying(false);
    setModifyingReport(null);
  };

  // Handle deleting the report during modification
  const handleDeleteReport = () => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      onModify({ ...modifyingReport, delete: true });
      setIsModifying(false);
      setModifyingReport(null);
    }
  };

  const fetchAddressSuggestions = async (query) => {
    if (query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      query
    )}&format=json&addressdetails=1&limit=5&viewbox=-139.06,60.00,-114.05,48.30&bounded=1&countrycodes=ca`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      setAddressSuggestions(data);
    } catch (error) {
      console.error("Error fetching address suggestions:", error);
    }
  };

  return (
    <div className="report-table">
      <h2>Visible Reports</h2>
      <div className="sorting-controls mb-4">
        <label>
          Sort by:
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="ml-2 border p-1 rounded"
          >
            <option value="id">ID</option>
            <option value="emergencyType">Emergency Type</option>
            <option value="reporterName">Reporter Name</option>
            <option value="address">Address</option>
            <option value="status">Status</option>
            <option value="timestamp">Time Reported</option>
          </select>
        </label>
        <label className="ml-4">
          Order:
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="ml-2 border p-1 rounded"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
      </div>

      {selectedReport && (
        <div className="report-details p-4 bg-gray-100 rounded-lg shadow-md mb-4">
          <h3 className="font-bold mb-2">Report Details</h3>
          <p>
            <strong>ID:</strong> {selectedReport.id}
          </p>
          <p>
            <strong>Emergency Type:</strong> {selectedReport.emergencyType}
          </p>
          <p>
            <strong>Reporter Name:</strong> {selectedReport.reporterName}
          </p>
          <p>
            <strong>Reporter Phone:</strong> {selectedReport.reporterPhone}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {selectedReport.address || "Unknown location"}
          </p>
          <p>
            <strong>Place Name:</strong> {selectedReport.placeName}
          </p>
          <p>
            <strong>Comments:</strong>{" "}
            {selectedReport.comments || "No comments available."}
          </p>
          <p>
            <strong>Timestamp:</strong>{" "}
            {new Date(selectedReport.timestamp).toLocaleString()}
          </p>
          <p>
            <strong>Status:</strong> {selectedReport.status}
          </p>
          {selectedReport.pictureUrl && (
            <div className="mt-4">
              <strong>Image:</strong>
              <img
                src={selectedReport.pictureUrl}
                alt="Report"
                className="mt-2 max-w-3xl h-auto rounded shadow"
              />
            </div>
          )}
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setSelectedReport(null)}
          >
            Close Details
          </button>
        </div>
      )}

      {/* Modification Modal */}
      {isModifying && modifyingReport && (
        <div className="modal fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Modify Report</h3>
            <label className="block mb-2">
              Emergency Type:
              <input
                type="text"
                name="emergencyType"
                value={modifyingReport.emergencyType}
                onChange={handleModifyChange}
                className="border p-2 rounded w-full"
              />
            </label>
            <label className="block mb-2">
              Reporter Name:
              <input
                type="text"
                name="reporterName"
                value={modifyingReport.reporterName}
                onChange={handleModifyChange}
                className="border p-2 rounded w-full"
              />
            </label>
            <label className="block mb-2">
              Reporter Phone:
              <input
                type="text"
                name="reporterPhone"
                value={modifyingReport.reporterPhone}
                onChange={handleModifyChange}
                className="border p-2 rounded w-full"
              />
            </label>

            <label className="block mb-2 relative">
              Address:
              <input
                type="text"
                name="address"
                value={modifyingReport.address}
                onChange={(e) => {
                  handleModifyChange(e);
                  fetchAddressSuggestions(e.target.value);
                }}
                className="border p-2 rounded w-full"
                autoComplete="off"
              />
              {addressSuggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border mt-1 w-full max-h-48 overflow-y-auto">
                  {addressSuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setModifyingReport({
                          ...modifyingReport,
                          address: suggestion.display_name,
                          geocode: {
                            lat: parseFloat(suggestion.lat), // Ensure lat is a number
                            lng: parseFloat(suggestion.lon), // Ensure lng is a number
                          },
                        });
                        setAddressSuggestions([]);
                      }}
                    >
                      {suggestion.display_name}
                    </li>
                  ))}
                </ul>
              )}
            </label>

            <label className="block mb-2">
              Place Name:
              <input
                type="text"
                name="placeName"
                value={modifyingReport.placeName}
                onChange={handleModifyChange}
                className="border p-2 rounded w-full"
              />
            </label>
            <label className="block mb-2">
              Picture URL:
              <input
                type="text"
                name="pictureUrl"
                value={modifyingReport.pictureUrl}
                onChange={handleModifyChange}
                className="border p-2 rounded w-full"
              />
            </label>
            <label className="block mb-2">
              Comments:
              <textarea
                name="comments"
                value={modifyingReport.comments}
                onChange={handleModifyChange}
                className="border p-2 rounded w-full"
              />
            </label>
            <div className="flex justify-between mt-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                onClick={handleSaveModification}
              >
                Save Changes
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleDeleteReport}
              >
                Delete Report
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => {
                  setIsModifying(false);
                  setModifyingReport(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments-only Modal */}
      {modalContent && (
        <div className="modal fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Comments</h3>
            <p className="mb-4">
              {modalContent.comments ||
                "No comments available for this report."}
            </p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setModalContent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {sortedReports.length === 0 ? (
        <p>No reports visible in the current map view.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border p-2">ID</th>
              <th className="border p-2">Emergency Type</th>
              <th className="border p-2">Reporter</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedReports.map((report) => (
              <tr
                key={report.id}
                className={`cursor-pointer hover:bg-gray-100 ${
                  report.id === focusedID ? "bg-blue-100" : ""
                }`}
                onClick={() => {
                  onReportSelect(report.id);
                  setSelectedReport(report);
                }}
              >
                <td className="border p-2">{report.id}</td>
                <td className="border p-2">{report.emergencyType}</td>
                <td className="border p-2">{report.reporterName}</td>
                <td className="border p-2">
                  {report.address || "Unknown location"}
                </td>
                <td className="border p-2">{report.status}</td>
                <td className="border p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalContent(report);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    View Comments
                  </button>
                  {report.status === "OPEN" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onResolve(report.id);
                      }}
                      className="ml-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Resolve
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleModifyClick(report);
                    }}
                    className="ml-2 bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                  >
                    Modify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

ReportTable.propTypes = {
  reports: propTypes.array.isRequired,
  focusedID: propTypes.number.isRequired,
  onReportSelect: propTypes.func.isRequired,
  onResolve: propTypes.func.isRequired,
  onModify: propTypes.func.isRequired, // Added prop type for onModify
};

export default ReportTable;
