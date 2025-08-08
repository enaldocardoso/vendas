const Produto = require('../models/produto');

exports.getAllProdutos = (req, res) => {
    Produto.getAll((err, produtos) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(produtos);
    });
};

exports.getProdutoById = (req, res) => {
    const codigo = req.params.codigo;
    Produto.getById(codigo, (err, produto) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!produto) {
            res.status(404).json({ error: 'Produto não encontrado' });
            return;
        }
        res.json(produto);
    });
};

exports.createProduto = (req, res) => {
    const novoProduto = req.body;
    Produto.create(novoProduto, (err, produto) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(201).json(produto);
    });
};

exports.updateProduto = (req, res) => {
    const codigo = req.params.codigo;
    const produtoAtualizado = req.body;
    Produto.update(codigo, produtoAtualizado, (err) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Produto atualizado com sucesso' });
    });
};

exports.deleteProduto = (req, res) => {
    const codigo = req.params.codigo;
    Produto.delete(codigo, (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Produto deletado com sucesso' });
    });
};