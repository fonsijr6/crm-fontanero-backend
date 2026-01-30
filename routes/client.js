// Rutas para clientes
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const {user} = require('../middleware/user.mw')

router.use(user);
// api/clients
router.post('/', clientController.addClient);
router.get('/', clientController.listClients);
router.put('/:id', clientController.updateClient);
router.delete('/:id',clientController.deleteClient);

module.exports = router;