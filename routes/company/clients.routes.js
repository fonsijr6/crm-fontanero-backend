const express = require("express");
const router = express.Router();

const Client = require("../../models/Client");
const controller = require("../../controllers/client.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");
const { requirePermission } = require("../../middleware/requirePermission");
const { auditAction } = require("../../middleware/auditAction");

// ✅ Crear cliente
router.post(
  "/",
  auth,
  requireRole(["owner", "admin", "worker"]),
  requirePermission("clients", "create"),
  auditAction({
    module: "clients",
    action: "create",
    getEntityLabel: (req, res) =>
      res.locals.client?.name || req.body.name,
  }),
  controller.createClient
);

// ✅ Listar clientes
router.get(
  "/",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
  requirePermission("clients", "view"),
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
  requirePermission("clients", "edit"),
  auditAction({
    module: "clients",
    action: "update",
    getEntityLabel: (req, res) =>
      res.locals.client?.name || req.body.name,
  }),
  controller.updateClient
);

// ✅ Eliminar cliente
router.delete(
  "/:id",
  auth,
  requireCompany(Client),
  requireRole(["owner", "admin"]),
  requirePermission("clients", "delete"),
  auditAction({
    module: "clients",
    action: "delete",
    getEntityLabel: (req, res) =>
      res.locals.client?.name,
  }),
  controller.deleteClient
);

module.exports = router;