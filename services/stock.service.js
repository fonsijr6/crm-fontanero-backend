// services/stock.service.js
const StockItem = require("../models/Stock");

module.exports = {
  async getAll(companyId) {
    return await StockItem.find({ companyId }).sort({ createdAt: -1 });
  },

  async getOne(companyId, itemId) {
    return await StockItem.findOne({ _id: itemId, companyId });
  },

  async create(companyId, userId, data) {
    if (!data.name || data.name.trim().length === 0)
      throw new Error("El nombre es obligatorio.");
    if (data.name.length > 80)
      throw new Error("El nombre no puede superar 80 caracteres.");

    return await StockItem.create({
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

  async update(companyId, itemId, data) {
    if (data.name && data.name.length > 80)
      throw new Error("El nombre no puede superar 80 caracteres.");

    return await StockItem.findOneAndUpdate(
      { _id: itemId, companyId },
      data,
      { new: true }
    );
  },

  async adjustStock(companyId, itemId, amount) {
    const item = await StockItem.findOne({ _id: itemId, companyId });

    if (!item) throw new Error("Elemento no encontrado.");

    const newQty = item.quantity + Number(amount);

    if (newQty < 0)
      throw new Error("La cantidad no puede quedar negativa.");

    item.quantity = newQty;
    await item.save();

    return item;
  },

  async remove(companyId, itemId) {
    return await StockItem.deleteOne({ _id: itemId, companyId });
  },
};