const Client = require("../models/Client");

module.exports = {
  async createClient(companyId, userId, data) {
    if (!companyId) throw new Error("La empresa es obligatoria.");

    if (!data.name || data.name.trim().length === 0)
      throw new Error("El nombre del cliente es obligatorio.");
    if (data.name.length > 80)
      throw new Error("El nombre no puede superar los 80 caracteres.");

    if (data.address && data.address.length > 150)
      throw new Error("La dirección no puede superar los 150 caracteres.");

    if (data.notes && data.notes.length > 500)
      throw new Error("Las notas no pueden superar los 500 caracteres.");

    return await Client.create({
      companyId,
      createdBy: userId,
      name: data.name.trim(),
      email: data.email?.trim() || "",
      phone: data.phone?.trim() || "",
      address: data.address?.trim() || "",
      clientNif: data.clientNif?.trim() || "",
      notes: data.notes || "",
      tags: data.tags || [],
    });
  },

  async getClients(companyId) {
    return await Client.find({ companyId }).sort({ createdAt: -1 });
  },

  async getClient(companyId, clientId) {
    return await Client.findOne({ _id: clientId, companyId });
  },

  async updateClient(companyId, clientId, data) {
    if (data.name && data.name.length > 80)
      throw new Error("El nombre no puede superar los 80 caracteres.");
    if (data.address && data.address.length > 150)
      throw new Error("La dirección no puede superar los 150 caracteres.");
    if (data.notes && data.notes.length > 500)
      throw new Error("Las notas no pueden superar los 500 caracteres.");

    return await Client.findOneAndUpdate(
      { _id: clientId, companyId },
      data,
      { new: true }
    );
  },

  async deleteClient(companyId, clientId) {
    return await Client.deleteOne({ _id: clientId, companyId });
  },
};