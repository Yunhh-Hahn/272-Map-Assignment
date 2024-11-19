// Clear localStorage on each page load to prevent storing previous submissions
localStorage.clear();

// Initialize Map
var map = L.map('map').setView([49.2827, -123.1207], 12); // Vancouver coordinates
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

// Emergency Reports Storage
var reports = []; // Clear storage means reports will always be empty initially

// Variable to track the report being edited
var currentEditingReportId = null;

// Add Existing Reports to Map
reports.forEach(addMarker);

// Ensure the event listener is added only once
document.getElementById('emergency-form').addEventListener('submit', function (e) {
  e.preventDefault();
  console.log('Form submitted.');

  // Collect form data
  var report = {
    reporterName: document.getElementById('reporter-name').value.trim(),
    reporterPhone: document.getElementById('reporter-phone').value.trim(),
    emergencyType: document.getElementById('emergency-type').value,
    location: document.getElementById('location').value.trim(),
    pictureLink: document.getElementById('picture-link').value.trim(),
    comments: document.getElementById('comments').value.trim(),
    timeDate: new Date().toLocaleString(),
    status: 'OPEN',
    // id will be set below
  };

  // Basic validation
  if (!report.reporterName || !report.reporterPhone || !report.emergencyType || !report.location) {
    alert('Please fill in all required fields.');
    return;
  }

  // Phone number validation
  var phonePattern = /^\(\d{3}\) \d{3} \d{4}$/;
  if (!phonePattern.test(report.reporterPhone)) {
    alert('Please enter a valid phone number in the format (604) 123 4567.');
    return;
  }

  // Geocode Location
  console.log('Geocoding location:', report.location);
  geocodeLocation(report.location, function (coords) {
    if (coords) {
      console.log('Geocoding successful:', coords);
      report.latitude = coords.lat;
      report.longitude = coords.lng;

      if (currentEditingReportId !== null) {
        // We're editing an existing report
        var existingReportIndex = reports.findIndex(r => r.id === currentEditingReportId);
        if (existingReportIndex !== -1) {
          // Remove the old marker from the map
          map.removeLayer(reports[existingReportIndex].marker);
          // Update the report
          report.id = currentEditingReportId; // Keep the same ID
          reports[existingReportIndex] = report;
        } else {
          // If for some reason the report isn't found, add it as new
          report.id = Date.now();
          reports.push(report);
        }
        // Reset currentEditingReportId
        currentEditingReportId = null;
      } else {
        // This is a new report
        report.id = Date.now();
        reports.push(report);
      }

      // Add marker to map
      addMarker(report);
      updateEmergencyList();

      // Reset the form
      document.getElementById('emergency-form').reset();
      document.getElementById('suggestions').innerHTML = '';
    } else {
      alert('Location not found.');
      console.error('Geocoding failed for address:', report.location);
      return; // Ensure that the function exits if geocoding fails
    }
  });
});

// Geocode Function
function geocodeLocation(address, callback) {
  var url =
    'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' +
    encodeURIComponent(address);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data && data[0]) {
        callback({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
      } else {
        callback(null);
      }
    })
    .catch((error) => {
      console.error('Error during geocoding:', error);
      callback(null);
    });
}

// Address Suggestions Function
document.getElementById('location').addEventListener('input', function () {
  var query = this.value.trim();
  var suggestionsContainer = document.getElementById('suggestions');
  suggestionsContainer.innerHTML = '';

  if (query.length < 3) {
    return;
  }

  var url =
    'https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=' +
    encodeURIComponent(query);

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data && data.length > 0) {
        data.forEach(function (item) {
          var suggestionItem = document.createElement('a');
          suggestionItem.className = 'list-group-item list-group-item-action';
          suggestionItem.textContent = item.display_name;
          suggestionItem.addEventListener('click', function () {
            document.getElementById('location').value = item.display_name;
            suggestionsContainer.innerHTML = '';
          });
          suggestionsContainer.appendChild(suggestionItem);
        });
      }
    })
    .catch((error) => {
      console.error('Error fetching address suggestions:', error);
    });
});

// Phone Number Input Masking
document.getElementById('reporter-phone').addEventListener('input', function (e) {
  var input = e.target.value.replace(/\D/g, ''); // Remove all non-digit characters
  var formattedPhone = '';

  if (input.length > 0) {
    formattedPhone += '(' + input.substring(0, 3);
  }
  if (input.length >= 3) {
    formattedPhone += ') ' + input.substring(3, 6);
  }
  if (input.length >= 6) {
    formattedPhone += ' ' + input.substring(6, 10);
  }

  e.target.value = formattedPhone;
});

// Add Marker to Map
function addMarker(report) {
  var markerIcon = L.icon({
    iconUrl: 'marker-icon.png', // You can customize the marker icon
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'marker-shadow.png',
    shadowSize: [41, 41],
  });

  var marker = L.marker([report.latitude, report.longitude], { icon: markerIcon }).addTo(map);
  marker.bindTooltip(report.emergencyType + ' at ' + report.location);
  marker.on('click', function () {
    displayReportDetails(report);
  });
  report.marker = marker;
}

// Update Emergency List
function updateEmergencyList() {
  var listContainer = document.getElementById('emergency-list');
  listContainer.innerHTML = '';

  // Sort reports by time (latest first)
  reports.sort(function (a, b) {
    return new Date(b.timeDate) - new Date(a.timeDate);
  });

  reports.forEach(function (report) {
    var listItem = document.createElement('a');
    listItem.className = 'list-group-item list-group-item-action';
    listItem.textContent = report.emergencyType + ' at ' + report.location;
    listItem.addEventListener('click', function () {
      map.setView([report.latitude, report.longitude], 15);
      report.marker.openTooltip();
      displayReportDetails(report);
    });
    listContainer.appendChild(listItem);
  });
}

// Display Report Details
function displayReportDetails(report) {
  var details = `
    <h5>Emergency Details</h5>
    <p><strong>Type:</strong> ${report.emergencyType}</p>
    <p><strong>Location:</strong> ${report.location}</p>
    <p><strong>Status:</strong> ${report.status}</p>
    <p><strong>Time:</strong> ${report.timeDate}</p>
    <p><strong>Comments:</strong> ${report.comments}</p>
    <button onclick="modifyReport(${report.id})" class="btn btn-warning btn-sm">Modify</button>
    <button onclick="deleteReport(${report.id})" class="btn btn-danger btn-sm">Delete</button>
  `;

  // Create a popup
  var popup = L.popup()
    .setLatLng([report.latitude, report.longitude])
    .setContent(details)
    .openOn(map);
}

// Modify Report Function
function modifyReport(reportId) {
  var passcode = prompt('Enter passcode to modify the report:');
  if (verifyPasscode(passcode)) {
    var report = reports.find((r) => r.id === reportId);
    if (report) {
      // Populate form with existing report data
      document.getElementById('reporter-name').value = report.reporterName;
      document.getElementById('reporter-phone').value = report.reporterPhone;
      document.getElementById('emergency-type').value = report.emergencyType;
      document.getElementById('location').value = report.location;
      document.getElementById('picture-link').value = report.pictureLink;
      document.getElementById('comments').value = report.comments;

      // Set the current editing report ID
      currentEditingReportId = reportId;

      // Close the popup
      map.closePopup();
    }
  } else {
    alert('Incorrect passcode.');
  }
}

// Delete Report Function
function deleteReport(reportId, confirmDelete = true) {
  var passcode = prompt('Enter passcode to delete the report:');
  if (!verifyPasscode(passcode)) {
    alert('Incorrect passcode.');
    return;
  }

  var reportIndex = reports.findIndex((r) => r.id === reportId);
  if (reportIndex !== -1) {
    var report = reports[reportIndex];
    // Remove marker from the map
    map.removeLayer(report.marker);
    // Remove report from the array
    reports.splice(reportIndex, 1);
    // Update the list
    updateEmergencyList();
    alert('Report deleted.');
    map.closePopup();
  }
}

// Passcode Verification
var passcodeHash =
  CryptoJS.MD5('1234').toString(); // Use '1234' as the default passcode

function verifyPasscode(input) {
  return (
    CryptoJS.MD5(input).toString() === passcodeHash
  );
}

// Initial List Update
updateEmergencyList();

// Clear All Reports Button Handler
document.getElementById('clear-reports').addEventListener('click', function () {
  if (confirm('Are you sure you want to clear all reports?')) {
    // Clear reports array and remove markers
    reports = [];
    map.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Update the emergency list UI
    updateEmergencyList();

    alert('All reports have been cleared.');
  }
});
