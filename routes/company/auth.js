const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");
const { auth } = require("../middleware/auth.mw");

// ✅ Login (empleados + owner)
router.post("/login", controller.login);

// ✅ Logout (opcional, si haces invalidación de tokens)
router.post("/logout", auth, controller.logout);

// ✅ Cambiar contraseña (empleado/owner)
router.put("/change-password", auth, controller.changePassword);

// ✅ Forzar cambio tras login (si mustChangePassword = true)
router.put("/force-password-change", auth, controller.forcePasswordChange);

// ✅ Ver perfil propio
router.get("/me", auth, controller.getProfile);

// ✅ Registrar actividad (opcional)
router.post("/activity", auth, controller.registerActivity);

module.exports = router;
``