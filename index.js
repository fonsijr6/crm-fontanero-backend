const express = require('express')
const connectDB = require('./config/db')

// Creamos el servidor
const app = express();
const PORT = 4000;

// Conectamos a la BD
connectDB();

app.use(express.json()); // Habilitamos que se puedan enviar json a nuestra aplicación

app.use('/api/clients', require('./routes/client'));

// Definimos la ruta principal
// app.get('/', (req, res) => {
//     res.send('Hola mundo');
// })

app.listen(PORT, () => {
    console.log('El servidor esta corriendo perfectamente')
})
