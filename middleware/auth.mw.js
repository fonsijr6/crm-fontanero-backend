// backend/middleware/auth.mw.js
const jwt = require("jsonwebtoken");
const User = require('../models/User'); // ajusta la ruta si difiere

module.exports.auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ msg: "No autorizado, falta token" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "No autorizado, falta token" });
    }

    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      console.error('[JWT] JWT_ACCESS_SECRET no está definido');
      return res.status(500).json({ msg: "Configuración JWT ausente" });
    }

    // Verifica y obtén el payload
    const payload = jwt.verify(token, secret); // p.ej. { id: '...' }

    // Soporta ambos: id o sub (elige uno y sé consistente)
    const userId = payload.id ?? payload.sub;
    if (!userId) {
      return res.status(401).json({ msg: "Token inválido (sin id/sub)" });
    }

    // Carga el usuario (sin password)
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(401).json({ msg: "Usuario no encontrado" });
    }

    // Deja ambas cosas por comodidad
    req.auth = payload; // el payload del JWT
    req.user = user;    // el documento de usuario (sin password)

    return next();
  } catch (err) {
    // Token expirado, mal formado, o firmado con otro secret
    return res.status(401).json({ msg: "Token inválido o expirado" });
  }
};