const express = require("express");
const router = express.Router();

const Client = require("../../models/Client");
const controller = require("../../controllers/client.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");
const { auditAction } = require("../../middleware/auditAction");

// ✅ Crear cliente (owner, admin, worker)
router.post(
  "/",
  auth,
  requireRole(["owner", "admin", "worker"]),
  auditAction("Crear cliente", "client"),
  controller.createClient
);

// ✅ Listar clientes de la empresa (todos menos viewer)
router.get(
  "/",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
  controller.getClients
);

// ✅ Obtener cliente concreto
router.get(
  "/:id",
  auth,
  requireCompany(Client),
  requireRole(["owner", "admin", "worker", "viewer"]),
  controller.getClient
);

// ✅ Actualizar cliente
router.put(
  "/:id",
  auth,
  requireCompany(Client),
  requireRole(["owner", "admin", "worker"]),
  auditAction("Actualizar cliente", "client"),
  controller.updateClient
);

// ✅ Eliminar cliente
router.delete(
  "/:id",
  auth,
  requireCompany(Client),
  requireRole(["owner", "admin"]),
  auditAction("Eliminar cliente", "client"),
  controller.deleteClient
);

module.exports = router;