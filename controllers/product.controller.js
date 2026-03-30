const productService = require("../services/product.service");

exports.createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(
      req.user.companyId,
      req.user.userId,
      req.body
    );

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await productService.getProducts(req.user.companyId);
    res.json(products);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await productService.getProduct(
      req.user.companyId,
      req.params.id
    );
    if (!product) return res.status(404).json({ msg: "Producto no encontrado" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(
      req.user.companyId,
      req.params.id,
      req.body
    );
    res.json(product);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await productService.deleteProduct(req.user.companyId, req.params.id);
    res.json({ msg: "Producto eliminado correctamente" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};