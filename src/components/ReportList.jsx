import { useState, useEffect } from 'react';
import propTypes from 'prop-types';

function ReportList({ reports, map, onReportSelect }) {
  const [visibleReports, setVisibleReports] = useState([]);

  useEffect(() => {
    const updateVisibleReports = () => {
      const bounds = map.getBounds();
      const visible = reports.filter((report) =>
        bounds.contains([report.geocode.lat, report.geocode.lng])
      );
      setVisibleReports(visible);
    };

    updateVisibleReports();
    map.on('moveend', updateVisibleReports);
    return () => {
      map.off('moveend', updateVisibleReports);
    };
  }, [map, reports]);

  // Function to handle sorting
  const [sortKey, setSortKey] = useState('timestamp'); // Default sort by time/date
  const sortedReports = [...visibleReports].sort((a, b) => {
    if (sortKey === 'emergencyType') {
      return a.emergencyType.localeCompare(b.emergencyType);
    } else if (sortKey === 'status') {
      return a.status.localeCompare(b.status);
    } else {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
  });

  return (
    <div className="report-list">
      <h2>Emergency Reports</h2>
      <div>
        <label>Sort by: </label>
        <select onChange={(e) => setSortKey(e.target.value)} value={sortKey}>
          <option value="timestamp">Time/Date</option>
          <option value="emergencyType">Emergency Type</option>
          <option value="status">Status</option>
        </select>
      </div>
      <ul>
        {sortedReports.map((report) => (
          <li key={report.id} onClick={() => onReportSelect(report.id)}>
            <strong>{report.emergencyType}</strong> at{' '}
            {report.address || 'Unknown location'} - {report.status}
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
};

export default ReportList;
