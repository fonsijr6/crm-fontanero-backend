const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    index: true 
  },

  name: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  notes: { type: String }

}, {
  timestamps: true, // → createdAt y updatedAt
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;

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