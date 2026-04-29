const Stock = require("../models/Stock");
const Product = require("../models/Product");

module.exports = {
  async getInventory(companyId) {
    return await Stock.find({ companyId })
      .populate("productId")
      .sort({ updatedAt: -1 });
  },

  async getByProduct(companyId, productId) {
    return await Stock.findOne({ companyId, productId })
      .populate("productId");
  },

  async createForProduct(companyId, productId, quantity = 0) {
    const product = await Product.findOne({ _id: productId, companyId });

    if (!product) {
      throw new Error("Producto no encontrado.");
    }

    if (product.type !== "material") {
      throw new Error("Solo los productos materiales pueden tener stock.");
    }

    const existing = await Stock.findOne({ companyId, productId });
    if (existing) return existing;

    return await Stock.create({
      companyId,
      name: data.name.trim(),
      category: data.category || "",
      quantity: data.quantity || 0,
      unit: data.unit || "unidad",
      price: data.price || 0,
      minStock: data.minStock || 0,
      updatedBy: userId,
    });
  },

  async adjust(companyId, stockId, amount) {
    const stock = await Stock.findOne({ _id: stockId, companyId });
    if (!stock) throw new Error("Stock no encontrado.");

    const newQty = stock.quantity + Number(amount);

    if (newQty < 0) {
      throw new Error("Stock negativo no permitido.");
    }

    stock.quantity = newQty;
    stock.lastMovementAt = new Date();
    await stock.save();

    return stock;
  },
};
