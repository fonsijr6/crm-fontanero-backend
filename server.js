const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Creamos el servidor
const app = express();
const PORT = 4000;

// Conectamos a la BD
connectDB();
app.use(cors());

app.use(express.json()); // Habilitamos que se puedan enviar json a nuestra aplicación


app.use('/api/auth', require('./routes/auth'));
app.use('/api/clients', require('./routes/client'));
app.use('/api/stock', require('./routes/stock'))

app.use((err, req, res, next) => {
  if (err?.type === 'entity.parse.failed') {
    return res.status(400).json({ msg: 'JSON inválido en la petición' });
  }
  next(err);
});

app.listen(PORT, () => {
    console.log('El servidor esta corriendo perfectamente')
})
