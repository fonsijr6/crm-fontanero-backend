const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
  name: { type: String, required: true },
  surname1: {type: String, required: true},
  surname2: {type: String},
  phone: { type: String },
  address: { type: String },
  notes: { type: String }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;