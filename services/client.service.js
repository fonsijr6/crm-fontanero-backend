const Client = require('../models/Client');

// =============== Crear cliente ================== //
exports.createClient = async(userId, data) => {
  return Client.create({ 
    userId,
    name: data.name,
    surname1: data.surname1,
    surname2: data.surname2,
    address: data.address,
    phone: data.phone,
    notes: data.notes
  });
}

// =============== Obtener todos los clientes del usuario ================== //
exports.getClients = async(userId) => {
  return Client.find({ userId }).sort({createdAt: -1});
}

// =============== Obtener un cliente por ID ================== //
exports.getClientById = async(userId, clientId) => {
  return Client.findOne({
    _id: clientId,
    userId
  });
}

// =============== Actualizar cliente ================== //
exports.updateClient = async(userId, clientId, data) => {
  return Client.findOneAndUpdate(
    { _id: clientId, userId },
    {
      name: data.name,
      surname1: data.surname1,
      surname2: data.surname2,
      address: data.address,
      phone: data.phone,
      notes: data.notes
    },
    { new: true }
  );
}

// =============== Eliminar cliente ================== //
exports.deleteClient = async(userId, clientId) => {
  return Client.findOneAndDelete({ _id: clientId, userId });
}

