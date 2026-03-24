// services/stock.service.js
const StockItem = require('../models/Stock');

// ✅ CREATE STOCK ITEM
exports.createItem = async (userId, data) => {
  return StockItem.create({
    userId,
    name: data.name,
    category: data.category,
    quantity: data.quantity ?? 0,
    unit: data.unit ?? "",
    unitPrice: data.unitPrice ?? 0,
    minStock: data.minStock ?? 0,
  });
};

// ✅ GET ALL STOCK ITEMS
exports.getItems = async (userId) => {
  return StockItem.find({ userId }).sort({ createdAt: -1 });
};

// ✅ GET STOCK ITEM BY ID
exports.getItemById = async (userId, itemId) => {
  return StockItem.findOne({ userId, _id: itemId });
};

// ✅ UPDATE STOCK ITEM
exports.updateItem = async (userId, itemId, data) => {
  return StockItem.findOneAndUpdate(
    { userId, _id: itemId },
    {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.quantity !== undefined && { quantity: data.quantity }),
      ...(data.unit !== undefined && { unit: data.unit }),
      ...(data.unitPrice !== undefined && { unitPrice: data.unitPrice }),
      ...(data.minStock !== undefined && { minStock: data.minStock }),
    },
    { new: true }
  );
};

// ✅ DELETE STOCK ITEM
exports.deleteItem = async (userId, itemId) => {
  return StockItem.findOneAndDelete({ userId, _id: itemId });
};