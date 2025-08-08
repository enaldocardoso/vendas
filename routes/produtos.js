const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');

router.get('/', produtoController.getAllProdutos);
router.get('/:codigo', produtoController.getProdutoById);
router.post('/', produtoController.createProduto);
router.put('/:codigo', produtoController.updateProduto);
router.delete('/:codigo', produtoController.deleteProduto);

module.exports = router;