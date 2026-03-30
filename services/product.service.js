const Product = require("../models/Product");

module.exports = {
  async createProduct(companyId, userId, data) {
    if (!companyId) throw new Error("La empresa es obligatoria.");

    if (!data.name || data.name.trim().length === 0)
      throw new Error("El nombre del producto es obligatorio.");
    if (data.name.length > 80)
      throw new Error("El nombre no puede superar los 80 caracteres.");

    if (data.description && data.description.length > 500)
      throw new Error("La descripción no puede superar los 500 caracteres.");

    if (data.price < 0)
      throw new Error("El precio no puede ser negativo.");

    if (data.taxRate < 0 || data.taxRate > 100)
      throw new Error("El impuesto debe estar entre 0 y 100.");

    return await Product.create({
      companyId,
      createdBy: userId,
      name: data.name.trim(),
      description: data.description || "",
      type: data.type || "product",
      price: data.price || 0,
      taxRate: data.taxRate || 21,
      unit: data.unit || "unidad",
      sku: data.sku?.trim() || "",
      stockQuantity: data.stockQuantity || 0,
      stockAlertThreshold: data.stockAlertThreshold || 0,
      imageUrl: data.imageUrl || "",
    });
  },

  async getProducts(companyId) {
    return await Product.find({ companyId });
  },

  async updateProduct(companyId, productId, data) {
    if (data.name && data.name.length > 80)
      throw new Error("El nombre no puede superar los 80 caracteres.");

    if (data.price < 0)
      throw new Error("El precio no puede ser negativo.");

    return await Product.findOneAndUpdate(
      { _id: productId, companyId },
      data,
      { new: true }
    );
  },

  async deleteProduct(companyId, productId) {
    return await Product.deleteOne({ _id: productId, companyId });
  },
};