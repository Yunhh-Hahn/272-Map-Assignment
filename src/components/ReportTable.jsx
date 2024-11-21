import React from 'react';
import propTypes from 'prop-types';

function ReportTable({ reports, onReportSelect, onResolve }) {
  return (
    <div className="report-table">
      <h2>Visible Reports</h2>
      {reports.length === 0 ? (
        <p>No reportssible in the current map view.</p>
      ) : (
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Emergency Type</th>
            <th>Reporter</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td>{report.id}</td>
              <td>{report.emergencyType}</td>
              <td>{report.reporterName}</td>
              <td>{report.address || 'Unknown location'}</td>
              <td>{report.status}</td>
              <td>
                <button onClick={() => onReportSelect(report.id)}>View</button>
                {report.status === 'OPEN' && (
                  <button onClick={() => onResolve(report.id)}>Resolve</button>
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
  onReportSelect: propTypes.func.isRequired, 
  onResolve: propTypes.func.isRequired,
};

export default ReportTable;
