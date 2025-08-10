import mysql from 'mysql2/promise'
import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = 3000;

app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
})

const calcDistance = (lat1, lon1, lat2, lon2) => {
    let theta1 = (lat1 * Math.PI) / 180;
    let del1 = (lon1 * Math.PI) / 180;
    let theta2 = (lat2 * Math.PI) / 180;
    let del2 = (lon2 * Math.PI) / 180;
    let R = 6371;
    let dist = 2 * R * Math.asin(Math.sqrt(Math.pow(Math.sin((theta2 - theta1) / 2), 2) +
        Math.cos(theta1) * Math.cos(theta2) * Math.pow(Math.sin((del2 - del1) / 2), 2)));
    return dist.toFixed(2);
}

app.get('/listSchools', async (req, res) => {
    const userLat = parseFloat(req.query.latitude);
    const userLon = parseFloat(req.query.longitude);

    if (isNaN(userLat) || isNaN(userLon)) {
        return res.status(400).json({ message: 'Invalid or missing latitude/longitude' });
    }

    try {
        const [rows] = await pool.query('SELECT * FROM schools');

        rows.forEach(row => {
            row.distance = calcDistance(userLat, userLon, row.latitude, row.longitude);
        })

        rows.sort((a, b) => a.distance - b.distance);

        res.json(rows);
    } catch (error) {
        console.error('Error fetching schools:', error);
        res.status(500).send('Internal Server Error');
    }
})

app.post('/addSchool', async (req, res) => {
    console.log('Received request to add school:', req.body);
    const { name, address, latitude, longitude } = req.body;
    if (!name || !address || !latitude || !longitude) {
        return res.status(400).send('Missing required parameters');
    }

    if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).send('Latitude and Longitude must be numbers');
    }

    if (!isNaN(name) || !isNaN(address)) {
        return res.status(400).send('Name and Address must be strings');
    }

    try {
        const [result] = await pool.query('INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)', [name, address, latitude, longitude]);
        if (result.affectedRows > 0) return res.status(201).send('School added successfully');
        else return res.status(500).send('Failed to add school');

    } catch (error) {
        console.error('Error adding school:', error);
    }
})

app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})