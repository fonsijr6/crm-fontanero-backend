const express = require("express");
const router = express.Router();

const Client = require("../../models/Client");
const controller = require("../../controllers/client.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");
const { auditAction } = require("../../middleware/auditAction");
const { requirePermission } = require("../../middleware/requirePermission");

// ✅ Crear cliente (owner, admin, worker)
router.post(
  "/",
  auth,
  requireRole(["owner", "admin", "worker"]),
  requirePermission("clients", "create"),
  auditAction("Crear cliente", "client"),
  controller.createClient
);

// ✅ Listar clientes de la empresa (todos menos viewer)
router.get(
  "/",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
  requirePermission("client", "view"),
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
  requireRole(["owner", "admin"]),
  auditAction("Actualizar cliente", "client"),
  requirePermission("client", "edit"),
  controller.updateClient
);

// ✅ Eliminar cliente
router.delete(
  "/:id",
  auth,
  requireCompany(Client),
  requireRole(["owner", "admin"]),
  auditAction("Eliminar cliente", "client"),
  requirePermission("client", "delete"),
  controller.deleteClient
);

module.exports = router;