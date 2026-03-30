const Product = require("../../models/Product");
const controller = require("../../controllers/product.controller");

const { auth } = require("../../middleware/auth.mw");
const { requireRole } = require("../../middleware/requireRole");
const { requireCompany } = require("../../middleware/requireCompany");

router.post(
  "/",
  auth,
  requireRole(["owner", "admin"]),
  controller.createProduct
);

router.get(
  "/",
  auth,
  requireRole(["owner", "admin", "worker", "viewer"]),
  controller.getProducts
);

router.get(
  "/:id",
  auth,
  requireCompany(Product),
  requireRole(["owner", "admin", "worker", "viewer"]),
  controller.getProduct
);

router.put(
  "/:id",
  auth,
  requireCompany(Product),
  requireRole(["owner", "admin"]),
  controller.updateProduct
);

router.delete(
  "/:id",
  auth,
  requireCompany(Product),
  requireRole(["owner"]),
  controller.deleteProduct
);