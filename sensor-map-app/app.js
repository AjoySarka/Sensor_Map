const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 3000;

// Create database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'yeedatabase.c5owe4guoa3o.us-east-2.rds.amazonaws.com',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'KSUwater!',
    database: process.env.DB_NAME || 'Tables'
});

// Connect to the database
db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
});

// Serve static files (HTML, CSS, etc.)
app.use(express.static('public'));

// Route for Sensor 1 data
app.get('/sensor1', (req, res) => {
    let query = 'SELECT reading_time, Temperature, date_time FROM YEE_Table WHERE sensor_id = 1';
    db.query(query, (err, result) => {
        if (err) throw err;
        res.send(renderSensorPage(result, 'Sensor 1 Data'));
    });
});

// Route for Sensor 2 data
app.get('/sensor2', (req, res) => {
    let query = 'SELECT reading_time, Temperature, Probe, date_time FROM YEE_Table WHERE sensor_id = 2';
    db.query(query, (err, result) => {
        if (err) throw err;
        res.send(renderSensorPage(result, 'Sensor 2 Data'));
    });
});

// Function to render sensor data in HTML format
function renderSensorPage(data, title) {
    let html = `<html><head><title>${title}</title></head><body><h1>${title}</h1><table border="1"><tr><th>Reading Time</th><th>Temperature</th>`;
    
    if (title === 'Sensor 2 Data') {
        html += '<th>Probe</th>';
    }
    
    html += '<th>Date Time</th></tr>';

    data.forEach(row => {
        html += `<tr><td>${row.reading_time}</td><td>${row.Temperature}</td>`;
        if (row.Probe) html += `<td>${row.Probe}</td>`;
        html += `<td>${row.date_time}</td></tr>`;
    });

    html += '</table></body></html>';
    return html;
}

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
