const {Client} = require('../models/Client');

async function createClient(ownerId, data) {
  return Client.create({ ownerId, ...data });
}

async function listClientsByOwner(ownerId) {
  return Client.find({ ownerId }).sort({ createdAt: -1 }).limit(50).lean();
}

async function updateClientByOwner(id, ownerId, data) {
  const allowed = ['name', 'phone', 'address', 'notes'];
  const payload = Object.fromEntries(
    Object.entries(data).filter(([k, v]) => allowed.includes(k) && v !== undefined)
  );

  return Client.findOneAndUpdate(
    { _id: id, ownerId },
    payload,
    { new: true, runValidators: true }
  ).lean();
}

async function getClientByOwner(id, ownerId) {
  return Client.findOne({ _id: id, ownerId }).lean();
}

async function deleteClientByOwner(id, ownerId) {
  return Client.findOneAndDelete({ _id: id, ownerId }).lean();
}

module.exports = {
  createClient,
  listClientsByOwner,
  updateClientByOwner,
  getClientByOwner,
  deleteClientByOwner
};
