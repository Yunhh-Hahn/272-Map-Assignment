import React, { useState, useEffect } from 'react';
import propTypes from 'prop-types';

function ReportTable({ reports, focusedID, onReportSelect, onResolve }) {
  const [sortKey, setSortKey] = useState('id'); // Default sort by ID
  const [sortOrder, setSortOrder] = useState('asc'); // Ascending order by default
  const [selectedReport, setSelectedReport] = useState(null); // For detailed view
  const [modalContent, setModalContent] = useState(null); // For comments-only modal

  // `reports`가 업데이트될 때 `selectedReport` 초기화
  useEffect(() => {
    if (selectedReport && !reports.some((report) => report.id === selectedReport.id)) {
      setSelectedReport(null); // 선택된 리포트가 현재 보이는 목록에 없으면 초기화
    }
  }, [reports, selectedReport]);

  // Function to sort reports
  const sortedReports = [...reports].sort((a, b) => {
    let comparison = 0;

    if (sortKey === 'emergencyType') {
      comparison = a.emergencyType.localeCompare(b.emergencyType);
    } else if (sortKey === 'reporterName') {
      comparison = a.reporterName.localeCompare(b.reporterName);
    } else if (sortKey === 'address') {
      comparison = a.address.localeCompare(b.address || '');
    } else if (sortKey === 'status') {
      comparison = a.status.localeCompare(b.status);
    } else if (sortKey === 'timestamp') {
      comparison = new Date(a.timestamp) - new Date(b.timestamp);
    } else {
      comparison = a.id - b.id; // Default sorting by ID
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

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

      {/* Detailed View Modal */}
      {selectedReport && (
        <div className="report-details p-4 bg-gray-100 rounded-lg shadow-md mb-4">
          <h3 className="font-bold mb-2">Report Details</h3>
          <p><strong>ID:</strong> {selectedReport.id}</p>
          <p><strong>Emergency Type:</strong> {selectedReport.emergencyType}</p>
          <p><strong>Reporter Name:</strong> {selectedReport.reporterName}</p>
          <p><strong>Reporter Phone:</strong> {selectedReport.reporterPhone}</p>
          <p><strong>Address:</strong> {selectedReport.address || 'Unknown location'}</p>
          <p><strong>Place Name:</strong> {selectedReport.placeName}</p>
          <p><strong>Comments:</strong> {selectedReport.comments || 'No comments available.'}</p>
          <p><strong>Timestamp:</strong> {new Date(selectedReport.timestamp).toLocaleString()}</p>
          <p><strong>Status:</strong> {selectedReport.status}</p>

          {/* Image Section */}
          {selectedReport.pictureUrl && (
            <div className="mt-4">
              <strong>Image:</strong>
              <img
                src={selectedReport.pictureUrl}
                alt="Report"
                className="mt-2 max-w-full h-auto rounded shadow"
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


      {/* Comments-only Modal */}
      {modalContent && (
        <div className="modal fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-md w-full">
            <h3 className="text-lg font-bold mb-4">Comments</h3>
            <p className="mb-4">
              {modalContent.comments || 'No comments available for this report.'}
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
                  report.id === focusedID ? 'bg-blue-100' : '' // focusedID로 강조
                }`}
                onClick={() => {
                  onReportSelect(report.id); // focusedID 업데이트
                  setSelectedReport(report); // Detail View 업데이트
                }}
              >
                <td className="border p-2">{report.id}</td>
                <td className="border p-2">{report.emergencyType}</td>
                <td className="border p-2">{report.reporterName}</td>
                <td className="border p-2">{report.address || 'Unknown location'}</td>
                <td className="border p-2">{report.status}</td>
                <td className="border p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 행 클릭 이벤트 방지
                      setModalContent(report);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    View Comments
                  </button>
                  {report.status === 'OPEN' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // 행 클릭 이벤트 방지
                        onResolve(report.id);
                      }}
                      className="ml-2 bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      Resolve
                    </button>
                  )}
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
  focusedID: propTypes.number.isRequired, // focusedID를 추가로 받음
  onReportSelect: propTypes.func.isRequired,
  onResolve: propTypes.func.isRequired,
};

export default ReportTable;
