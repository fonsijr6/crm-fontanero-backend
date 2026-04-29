const Product = require("../models/Product");
const stockService = require("./stock.service");

module.exports = {
  async createProduct(companyId, userId, data) {
    if (!companyId) throw new Error("La empresa es obligatoria.");

    if (!data.name || data.name.trim().length === 0) {
      throw new Error("El nombre del producto es obligatorio.");
    }

    if (data.name.length > 100) {
      throw new Error("El nombre no puede superar los 100 caracteres.");
    }

    if (!["material", "service"].includes(data.type)) {
      throw new Error("El tipo de producto no es válido.");
    }

    if (data.unitPrice < 0) {
      throw new Error("El precio no puede ser negativo.");
    }

    if (data.taxRate < 0 || data.taxRate > 100) {
      throw new Error("El impuesto debe estar entre 0 y 100.");
    }

    const product = await Product.create({
      companyId,
      createdBy: userId,
      name: data.name.trim(),
      description: data.description || "",
      type: data.type,
      unitPrice: data.unitPrice,
      taxRate: data.taxRate ?? 21,
      unit: data.unit || "unidad",
      category: data.category?.trim() || "",
      imageUrl: data.imageUrl || "",
      isActive: true,
    });

    // ✅ CREAR STOCK AUTOMÁTICO SOLO SI ES MATERIAL
    if (product.type === "material") {
      await stockService.createForProduct(
        companyId,
        product._id,
        Number(data.initialStock) || 0
      );
    }

    return product;
  },

  async getProducts(companyId) {
    return await Product.find({ companyId, isActive: true })
      .sort({ createdAt: -1 });
  },

  async updateProduct(companyId, productId, data) {
    const product = await Product.findOne({ _id: productId, companyId });
    if (!product) throw new Error("Producto no encontrado.");

    if (data.name && data.name.length > 100) {
      throw new Error("El nombre no puede superar los 100 caracteres.");
    }

    if (data.unitPrice !== undefined && data.unitPrice < 0) {
      throw new Error("El precio no puede ser negativo.");
    }

    // ❌ NO permitir cambiar tipo una vez creado (clave)
    if (data.type && data.type !== product.type) {
      throw new Error("No se puede cambiar el tipo de un producto.");
    }

    Object.assign(product, data, { updatedBy: data.updatedBy || null });
    await product.save();

    return product;
  },

  
  async deleteProduct(companyId, productId) {
    const product = await Product.findOne({ _id: productId, companyId });
    if (!product) {
      throw new Error("Producto no encontrado");
    }

    // ✅ Si es material, borrar su stock asociado
    if (product.type === "material") {
      await Stock.deleteOne({
        companyId,
        productId: product._id
      });
    }

    // ✅ Borrar producto
    await Product.deleteOne({
      _id: product._id,
      companyId
    });

    return true;
  }
};
