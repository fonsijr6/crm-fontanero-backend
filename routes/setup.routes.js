const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Company = require("../models/Company");
const User = require("../models/User");

// ✅ Crear empresa desde Postman
router.post("/company", async (req, res) => {
  try {
    const company = await Company.create({
      name: req.body.name,
      legalName: req.body.legalName || "",
      companyNif: req.body.companyNif,
      fiscalAddress: req.body.fiscalAddress || "",
      companyEmail: req.body.companyEmail || "",
      companyPhone: req.body.companyPhone || "",
      modulesEnabled: [
        "clients", "tasks", "products", "invoices", "quotes", "stock"
      ],
      settings: {
        invoicePrefix: "FAC-",
        quotePrefix: "PRES-",
        taskPrefix: "TSK-",
        lastInvoiceNumber: 0,
        lastQuoteNumber: 0,
        lastTaskNumber: 0
      }
    });

    res.json(company);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

// ✅ Crear OWNER desde Postman
router.post("/owner", async (req, res) => {
  try {
    const hashed = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashed,
      role: "owner",
      companyId: req.body.companyId,
      isActive: true,
      permissions: {
        clients: { view: true, create: true, edit: true, delete: true },
        tasks: { view: true, create: true, edit: true, delete: true, assign: true, complete: true },
        products: { view: true, create: true, edit: true, delete: true },
        invoices: { view: true, create: true, edit: true, delete: true },
        quotes: { view: true, create: true, edit: true, delete: true },
        users: { view: true, create: true, edit: true, delete: true },
        stock: { view: true, create: true, edit: true, delete: true }
      }
    });

    res.json(user);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
});

module.exports = router;