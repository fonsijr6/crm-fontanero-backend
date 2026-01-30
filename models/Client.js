const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  notes: { type: String }
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;