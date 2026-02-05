const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, required: true, index: true},
  name: { type: String, required: true },
  typeMaterial: { type: String, required: true },
  warehouseUnits: { type: Number, default: 0 },
  vanUnits: { type: Number, default: 0 }
}, {
  timestamps: true,
  versionKey: false, // oculta __v
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString(); // añade id legible
      delete ret._id;  // oculta _id
      return ret;
    }
  },
  toObject: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    }
  }
});

const StockItem = mongoose.model('StockItem', stockSchema);
module.exports = StockItem;