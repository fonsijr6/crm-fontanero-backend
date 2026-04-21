const Task = require("../models/Task");

module.exports = {
  async createTask(companyId, userId, data) {
    if (!companyId) throw new Error("La empresa es obligatoria.");
    if (!data.title?.trim()) throw new Error("Título obligatorio.");
    if (!data.client && !data.clientId)
      throw new Error("La tarea debe estar vinculada a un cliente.");

    return Task.create({
      companyId,
      createdBy: userId,
      client: data.client ?? data.clientId,
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
    if (clientId) filter.client = clientId;

    return Task.find(filter)
      .sort({ createdAt: -1 })
      .populate("client", "name email")
      .populate("assignedTo", "name role email");
  },

  async getTask(companyId, taskId) {
    return Task.findOne({ _id: taskId, companyId })
      .populate("client", "name email")
      .populate("assignedTo", "name role email");
  },

  async updateTask(companyId, taskId, data) {
    if (data.clientId) {
      data.client = data.clientId;
      delete data.clientId;
    }

    return Task.findOneAndUpdate(
      { _id: taskId, companyId },
      data,
      { new: true }
    )
      .populate("client", "name email")
      .populate("assignedTo", "name role email");
  },

  async deleteTask(companyId, taskId) {
    return Task.deleteOne({ _id: taskId, companyId });
  },
};