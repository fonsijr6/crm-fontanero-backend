// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {user} = require('../middleware/user.mw')

// --- Config JWT (desde variables de entorno) ---
const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TTL  = process.env.JWT_ACCESS_TTL  || '15m';
const REFRESH_TTL = process.env.JWT_REFRESH_TTL || '7d'; // por si lo necesitas en otros sitios

router.use(user)
// Rutas para usuario
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// /refresh: emite un nuevo access token a partir del refresh en cookie HttpOnly
router.post('/refresh', userController.refreshToken);

module.exports = router;