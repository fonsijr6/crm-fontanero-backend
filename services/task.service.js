const Task = require('../models/Task');

// Obtener todas las tareas del usuario, opcionalmente filtrando por cliente
exports.getTasks = async (userId, clientId) => {
  const filter = { userId };
  if (clientId) filter.clientId = clientId;  // agregamos filtro si se pasa clientId

  return Task.find(filter)
    .sort({ date: 1, time: 1 });
};

// Los demás métodos se mantienen igual
exports.createTask = async (userId, data) => {
  return Task.create({ userId, ...data });
};

exports.getTaskById = async (userId, taskId) => {
  return Task.findOne({ userId, _id: taskId });
};

exports.updateTask = async (userId, taskId, data) => {
  return Task.findOneAndUpdate(
    { userId, _id: taskId },
    { ...data },
    { new: true }
  );
};

exports.deleteTask = async (userId, taskId) => {
  return Task.findOneAndDelete({ userId, _id: taskId });
};