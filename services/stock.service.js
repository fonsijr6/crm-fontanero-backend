const StockItem = require('../models/Stock');

// =============== Crear material ================== //
exports.createItem = async(userId, data) => {
  return StockItem.create({ 
    userId,
    name: data.name,
    typeMaterial: data.typeMaterial,
    warehouseUnits: data.warehouseUnits ?? 0,
    vanUnits: data.vanUnits ?? 0
  });
}

// =============== Obtener todo el stock del usuario ================== //
exports.getItems = async(userId) => {
  return StockItem.find({ userId }).sort({createdAt: -1});
}

// =============== Obtener material por ID ================== //
exports.getItemById = async(userId, itemId) => {
  return StockItem.findOne({
    _id: itemId,
    userId
  });
}

// =============== Actualizar material ================== //
exports.updateItem = async(userId, itemId, data) => {
  return StockItem.findOneAndUpdate(
    { _id: itemId, userId },
    {
      name: data.name,
      typeMaterial: data.typeMaterial,
      warehouseUnits: data.warehouseUnits,
      vanUnits: data.vanUnits
    },
    { new: true }
  );
}

// =============== Eliminar material ================== //
exports.deleteItem = async(userId, itemId) => {
  return StockItem.findOneAndDelete({ _id: itemId, userId });
}

