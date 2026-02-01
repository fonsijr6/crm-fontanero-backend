const express = require('express');
const router = express.Router();
const controller = require('../controllers/client.controller');
const {auth} = require('../middleware/auth.mw')

router.use(auth);

// api/clients
router.post('/', controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getOne);
router.put('/:id', controller.update);
router.delete('/:id',controller.remove);

module.exports = router;