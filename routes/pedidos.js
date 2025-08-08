const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.get('/', pedidoController.getAllPedidos);
router.get('/:codigo', pedidoController.getPedidoById);
router.post('/', pedidoController.createPedido);
router.delete('/:codigo', pedidoController.deletePedido);

module.exports = router;