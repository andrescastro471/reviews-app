const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

let reviews = [];

// Generar link unico
app.post('/generar-link', (req, res) => {
  const uniqueID = uuidv4();
  const reviewLink = `http://localhost:3000/review/${uniqueID}`;
  res.json({ link: reviewLink });
});

// Servir el formulario cuando el cliente abre el link
app.get('/review/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'review.html'));
});

// Recibir el review enviado
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

// Ver todos los reviews
app.get('/reviews', (req, res) => {
  res.json(reviews);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
