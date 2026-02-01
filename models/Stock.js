const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true},
  name: { type: String, required: true },
  typeMaterial: { type: String, required: true },
  warehouseUnits: { type: Number, default: 0 },
  vanUnits: { type: Number, default: 0 }
}, { timestamps: true });

const StockItem = mongoose.model('StockItem', stockSchema);
module.exports = StockItem;