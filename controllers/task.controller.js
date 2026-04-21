const taskService = require("../services/task.service");

exports.createTask = async (req, res) => {
  try {
    const task = await taskService.createTask(
      req.user.companyId,
      req.user.userId,
      req.body
    );

    res.locals.task = task;
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { clientId } = req.query;

    const tasks = await taskService.getTasks(
      req.user.companyId,
      clientId
    );

    res.json(tasks);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await taskService.getTask(
      req.user.companyId,
      req.params.id
    );

    if (!task) {
      return res.status(404).json({ msg: "Tarea no encontrada" });
    }

    res.json(task);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await taskService.updateTask(
      req.user.companyId,
      req.params.id,
      req.body
    );

    res.locals.task = task;
    res.json(task);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await taskService.deleteTask(req.user.companyId, req.params.id);
    res.json({ msg: "Tarea eliminada correctamente" });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};