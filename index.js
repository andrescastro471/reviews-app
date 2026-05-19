const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.query(`
  CREATE TABLE IF NOT EXISTS reviews (
    id TEXT PRIMARY KEY,
    nombre TEXT,
    mensaje TEXT,
    estrellas INTEGER,
    fecha TIMESTAMP DEFAULT NOW()
  )
`);

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type'] }));
app.options('*', cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/generar-link', (req, res) => {
  const id = uuidv4();
  const link = `https://reviews-app-production-1d39.up.railway.app/review/${id}`;
  res.json({ link });
});

app.get('/review/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'review.html'));
});

app.post('/review/:id', async (req, res) => {
  const { nombre, mensaje, estrellas } = req.body;
  await pool.query(
    'INSERT INTO reviews (id, nombre, mensaje, estrellas) VALUES ($1, $2, $3, $4)',
    [req.params.id, nombre, mensaje, estrellas]
  );
  res.json({ success: true });
});

app.get('/reviews', async (req, res) => {
  const result = await pool.query('SELECT * FROM reviews ORDER BY fecha DESC');
  res.json(result.rows);
});

app.delete('/reviews/:id', async (req, res) => {
  await pool.query('DELETE FROM reviews WHERE id = $1', [req.params.id]);
  res.json({ success: true });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
