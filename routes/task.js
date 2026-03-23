const express = require('express');
const router = express.Router();
const controller = require('../controllers/task.controller');
const { auth } = require('../middleware/auth.mw');

router.use(auth);

// api/tasks
router.post('/', controller.create);         // Crear tarea
router.get('/', controller.getAll);          // Listar todas las tareas del usuario
router.get('/:id', controller.getOne);       // Obtener tarea por ID
router.put('/:id', controller.update);       // Actualizar tarea
router.delete('/:id', controller.remove);    // Eliminar tarea

module.exports = router;