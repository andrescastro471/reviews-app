const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.options('*', cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

let reviews = [];

app.post('/generar-link', (req, res) => {
  const id = uuidv4();
  const link = `https://reviews-app-production-1d39.up.railway.app/review/${id}`;
  res.json({ link });
});

app.get('/review/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'review.html'));
});

app.post('/review/:id', (req, res) => {
  const { nombre, mensaje, estrellas } = req.body;
  const review = {
    id: req.params.id,
    nombre,
    mensaje,
    estrellas,
    fecha: new Date()
  };
  reviews.push(review);
  res.json({ success: true, review });
});

app.get('/reviews', (req, res) => {
  res.json(reviews);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
