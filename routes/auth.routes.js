const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");
const { auth } = require("../middleware/auth.mw");

// ✅ Login (web + móvil)
router.post("/login", controller.login);

// ✅ Refresh token (se llama automáticamente al cargar la app)
router.post("/refresh", controller.refresh);

// ✅ Obtener perfil del usuario autenticado
router.get("/me", auth, controller.me);

// ✅ Cerrar sesión
router.post("/logout", controller.logout);

module.exports = router;