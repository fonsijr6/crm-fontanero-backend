const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  name: { type: String, required: true },
  surname1: { type: String, required: true },
  surname2: { type: String },
  phone: { type: String },
  address: { type: String },
  notes: { type: String }
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

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;