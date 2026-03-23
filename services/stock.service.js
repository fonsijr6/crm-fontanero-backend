const StockItem = require('../models/Stock');

// =============== Create stock item ================== //
exports.createItem = async (userId, data) => {
  return StockItem.create({
    userId,
    name: data.name,
    typeMaterial: data.typeMaterial,
    warehouseUnits: data.warehouseUnits ?? 0,
    vanUnits: data.vanUnits ?? 0,
  });
};

// =============== Get all stock items of user ================== //
exports.getItems = async (userId) => {
  return StockItem.find({ userId })
    .sort({ createdAt: -1 })
    .lean({ virtuals: true });
};

// =============== Get stock item by ID ================== //
exports.getItemById = async (userId, itemId) => {
  return StockItem.findOne({ userId, _id: itemId }).lean({ virtuals: true });
};

// =============== Update stock item ================== //
exports.updateItem = async (userId, itemId, data) => {
  return StockItem.findOneAndUpdate(
    { userId, _id: itemId },
    {
      ...(data.name && { name: data.name }),
      ...(data.typeMaterial && { typeMaterial: data.typeMaterial }),
      ...(data.warehouseUnits !== undefined && { warehouseUnits: data.warehouseUnits }),
      ...(data.vanUnits !== undefined && { vanUnits: data.vanUnits }),
    },
    { new: true }
  ).lean({ virtuals: true });
};

// =============== Delete stock item ================== //
exports.deleteItem = async (userId, itemId) => {
  return StockItem.findOneAndDelete({ userId, _id: itemId });
};