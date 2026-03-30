// routes/admin/company.routes.js
const express = require("express");
const router = express.Router();

const controller = require("../../controllers/admin/adminCompany.controller");
const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");

// ❗ Solo superadmin puede crear empresas
router.post("/", auth, requireRole(["superadmin"]), controller.createCompanyWithOwner);

module.exports = router;