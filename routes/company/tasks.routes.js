const express = require("express");
const router = express.Router();

const Task = require("../../models/Task");
const controller = require("../../controllers/task.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");
const { auditAction } = require("../../middleware/auditAction");
const { requirePermission } = require("../../middleware/requirePermission");

router.post(
  "/",
  auth,
  requireRole(["owner", "admin", "worker"]),
  auditAction("Crear aviso", "tasks"),
  requirePermission("tasks", "create"),
  controller.createTask
);

router.get(
  "/",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
  requirePermission("tasks", "view"),
  controller.getTasks
);

router.get(
  "/:id",
  auth,
  requireCompany(Task),
  requireRole(["owner", "admin", "worker", "viewer"]),
  controller.getTask
);

router.put(
  "/:id",
  auth,
  requireCompany(Task),
  requireRole(["owner", "admin", "worker"]),
  auditAction("Actualizar aviso", "tasks"),
  requirePermission("tasks", "edit"),
  controller.updateTask
);

router.delete(
  "/:id",
  auth,
  requireCompany(Task),
  requireRole(["owner", "admin"]),
  auditAction("Eliminar aviso", "tasks"),
  requirePermission("tasks", "delete"),
  controller.deleteTask
);

module.exports = router;