// controllers/task.controller.js
const taskService = require('../services/task.service');
const mongoose = require('mongoose');

/**
 * Create task
 * POST /tasks
 */
exports.create = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { clientId, clientName, address, description, date, time, status } = req.body || {};
    const errors = [];

    if (!clientId || !mongoose.Types.ObjectId.isValid(clientId)) errors.push('Valid clientId is required');
    if (!clientName || typeof clientName !== 'string') errors.push('clientName is required and must be string');
    if (!address || typeof address !== 'string') errors.push('Address is required and must be string');
    if (!description || typeof description !== 'string') errors.push('Description is required and must be string');
    if (!date || typeof date !== 'string') errors.push('Date is required and must be string');
    if (!time || typeof time !== 'string') errors.push('Time is required and must be string');
    if (!status || !['pending', 'in_progress', 'completed'].includes(status))
      errors.push('Status must be pending, in_progress or completed');

    if (errors.length) return res.status(400).json({ message: 'Invalid data', errors });

    const payload = { clientId, clientName, address, description, date, time, status };
    const task = await taskService.createTask(req.user.id, payload);

    return res.status(201).json(task);

  } catch (error) {
    console.error('Error creating task:', error);
    return res.status(500).json({ message: 'Error creating task' });
  }
};


/**
 * ✅ FIX: Get all tasks (clientId is OPTIONAL now)
 * GET /tasks
 */
exports.getAll = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const clientId = req.query.clientId; // puede ser undefined

    let tasks;

    if (clientId && mongoose.Types.ObjectId.isValid(clientId)) {
      // ✅ Filtrar por cliente si viene en la query
      tasks = await taskService.getTasks(req.user.id, clientId);
    } else {
      // ✅ Si no hay clientId → devolver todas las tareas del usuario
      tasks = await taskService.getTasks(req.user.id);
    }

    return res.status(200).json(tasks);

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ message: 'Error fetching tasks' });
  }
};


/**
 * Get task by ID
 * GET /tasks/:id
 */
exports.getOne = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid task ID' });

    const task = await taskService.getTaskById(req.user.id, id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    return res.json(task);

  } catch (error) {
    console.error('Error fetching task:', error);
    return res.status(500).json({ message: 'Error fetching task' });
  }
};


/**
 * Update task
 * PUT /tasks/:id
 */
exports.update = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid task ID' });

    const { clientId, clientName, address, description, date, time, status } = req.body || {};
    const errors = [];

    if (clientId !== undefined && !mongoose.Types.ObjectId.isValid(clientId))
      errors.push('clientId must be valid ObjectId');
    if (clientName !== undefined && typeof clientName !== 'string')
      errors.push('clientName must be string');
    if (address !== undefined && typeof address !== 'string') errors.push('address must be string');
    if (description !== undefined && typeof description !== 'string')
      errors.push('description must be string');
    if (date !== undefined && typeof date !== 'string') errors.push('date must be string');
    if (time !== undefined && typeof time !== 'string') errors.push('time must be string');
    if (status !== undefined && !['pending', 'in_progress', 'completed'].includes(status))
      errors.push('status must be pending, in_progress or completed');

    if (errors.length) return res.status(400).json({ message: 'Invalid data', errors });

    const payload = {
      ...(clientId !== undefined && { clientId }),
      ...(clientName !== undefined && { clientName }),
      ...(address !== undefined && { address }),
      ...(description !== undefined && { description }),
      ...(date !== undefined && { date }),
      ...(time !== undefined && { time }),
      ...(status !== undefined && { status }),
    };

    const task = await taskService.updateTask(req.user.id, id, payload);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    return res.json(task);

  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ message: 'Error updating task' });
  }
};


/**
 * Delete task
 * DELETE /tasks/:id
 */
exports.remove = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: 'Unauthorized' });

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid task ID' });

    const task = await taskService.deleteTask(req.user.id, id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    return res.sendStatus(204);

  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Error deleting task' });
  }
};