const Client = require('../models/Client');

// =============== Create client ================== //
exports.createClient = async (userId, data) => {
  return Client.create({
    userId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    address: data.address,
    notes: data.notes,
  });
};

// =============== Get all clients of user ================== //
exports.getClients = async (userId) => {
  return Client.find({ userId })
    .sort({ createdAt: -1 });
};

// =============== Get client by ID ================== //
exports.getClientById = async (userId, clientId) => {
  return Client.findOne({ userId, _id: clientId });
};

// =============== Update client ================== //
exports.updateClient = async (userId, clientId, data) => {
  return Client.findOneAndUpdate(
    { userId, _id: clientId },
    {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.phone && { phone: data.phone }),
      ...(data.address && { address: data.address }),
      ...(data.notes && { notes: data.notes }),
    },
    { new: true }
  );
};

// =============== Delete client ================== //
exports.deleteClient = async (userId, clientId) => {
  return Client.findOneAndDelete({ userId, _id: clientId });
};