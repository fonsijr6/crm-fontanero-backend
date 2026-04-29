const express = require("express");
const router = express.Router();

const Task = require("../../models/Task");
const controller = require("../../controllers/task.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireCompany } = require("../../middleware/requireCompany");
const { requirePermission } = require("../../middleware/requirePermission");
const { requireRole } = require("../../middleware/requireRole");
const { auditAction } = require("../../middleware/auditAction");

// Crear aviso
router.post(
  "/",
  auth,
  requirePermission("tasks", "create"),
  auditAction({
    module: "tasks",
    action: "create",
    getEntityLabel: (req, res) =>
      res.locals.task?.title || req.body.title,
  }),
  controller.createTask
);

// Listar avisos
router.get(
  "/",
  auth,
  requirePermission("tasks", "view"),
  controller.getTasks
);

// Obtener aviso concreto
router.get(
  "/:id",
  auth,
  requireCompany(Task),
  requireRole(["owner", "admin", "worker", "viewer"]),
  controller.getTask
);

// Actualizar aviso
router.put(
  "/:id",
  auth,
  requireCompany(Task),
  requirePermission("tasks", "edit"),
  requireRole(["owner", "admin", "worker", "viewer"]),
  auditAction({
    module: "tasks",
    action: "update",
    getEntityLabel: (req, res) =>
      res.locals.task?.title || req.body.title,
  }),
  controller.updateTask
);

// Eliminar aviso
router.delete(
  "/:id",
  auth,
  requireCompany(Task),
  requirePermission("tasks", "delete"),
  requireRole(["owner", "admin"]),
  auditAction({
    module: "tasks",
    action: "delete",
    getEntityLabel: (req, res) =>
      res.locals.task?.title,
  }),
  controller.deleteTask
);

module.exports = router;
