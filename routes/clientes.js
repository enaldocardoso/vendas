const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');

router.get('/', clienteController.getAllClientes);
router.get('/:codigo', clienteController.getClienteById);
router.post('/', clienteController.createCliente);
router.put('/:codigo', clienteController.updateCliente);
router.delete('/:codigo', clienteController.deleteCliente);

module.exports = router;