const express = require("express");
const router = express.Router();

const Task = require("../../models/Task");
const controller = require("../../controllers/task.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");
const { auditAction } = require("../../middleware/auditAction");

router.post(
  "/",
  auth,
  requireRole(["owner", "admin", "worker"]),
  auditAction("Crear aviso", "task"),
  controller.createTask
);

router.get(
  "/",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
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
  auditAction("Actualizar aviso", "task"),
  controller.updateTask
);

router.delete(
  "/:id",
  auth,
  requireCompany(Task),
  requireRole(["owner", "admin"]),
  auditAction("Eliminar aviso", "task"),
  controller.deleteTask
);