const Task = require("../models/Task");

module.exports = {
  async createTask(companyId, userId, data) {
    if (!companyId) throw new Error("La empresa es obligatoria.");

    if (!data.title || data.title.trim().length === 0)
      throw new Error("El título de la tarea es obligatorio.");
    if (data.title.length > 80)
      throw new Error("El título no puede superar los 80 caracteres.");

    if (data.description && data.description.length > 500)
      throw new Error("La descripción no puede superar los 500 caracteres.");

    if (!data.clientId)
      throw new Error("La tarea debe estar vinculada a un cliente.");

    return await Task.create({
      companyId,
      createdBy: userId,
      clientId: data.clientId,
      assignedTo: data.assignedTo || null,
      title: data.title.trim(),
      description: data.description || "",
      date: data.date,
      time: data.time || "",
      address: data.address?.trim() || "",
      images: data.images || [],
      status: "pending",
      priority: data.priority || "medium",
    });
  },

  async getTasks(companyId, clientId = null) {
    const filter = { companyId };

    if (clientId) {
      filter.clientId = clientId;
    }

    return await Task.find(filter)
      .populate("clientId assignedTo");
  },

  async getTask(companyId, taskId) {
    return await Task.findOne({ _id: taskId, companyId })
      .populate("clientId assignedTo");
  },

  async updateTask(companyId, taskId, data) {
    if (data.title && data.title.length > 80)
      throw new Error("El título no puede superar los 80 caracteres.");

    if (data.description && data.description.length > 500)
      throw new Error("La descripción no puede superar los 500 caracteres.");

    if (data.images && data.images.length > 20)
      throw new Error("No puedes añadir más de 20 imágenes.");

    return await Task.findOneAndUpdate(
      { _id: taskId, companyId },
      data,
      { new: true }
    );
  },

  async deleteTask(companyId, taskId) {
    return await Task.deleteOne({ _id: taskId, companyId });
  },
};