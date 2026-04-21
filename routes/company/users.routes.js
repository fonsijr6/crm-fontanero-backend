const express = require("express");
const router = express.Router();

const User = require("../../models/User");
const controller = require("../../controllers/user.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");

// Listar empleados
router.get("/", auth, requireRole(["owner", "admin"]), controller.getUsers);

// Crear empleado
router.post("/", auth, requireRole(["owner"]), controller.createUser);

// Ver empleado
router.get("/:id", auth, requireCompany(User), requireRole(["owner", "admin"]), controller.getUser);

// Actualizar empleado
router.put("/:id", auth, requireCompany(User), requireRole(["owner"]), controller.updateUser);

// Cambiar permisos
router.put("/:id/permissions", auth, requireRole(["owner"]), controller.updatePermissions);

// Desactivar empleado
router.put("/:id/deactivate", auth, requireCompany(User), requireRole(["owner"]), controller.deactivateUser);

// Eliminar empleado
router.delete("/:id", auth, requireCompany(User), requireRole(["owner"]), controller.deleteUser);

module.exports = router;