const Cliente = require('../models/cliente');

exports.getAllClientes = (req, res) => {
    Cliente.getAll((err, clientes) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(clientes);
    });
};

exports.getClienteById = (req, res) => {
    const codigo = req.params.codigo;
    Cliente.getById(codigo, (err, cliente) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!cliente) {
            res.status(404).json({ error: 'Cliente não encontrado' });
            return;
        }
        res.json(cliente);
    });
};

exports.createCliente = (req, res) => {
    const novoCliente = req.body;
    Cliente.create(novoCliente, (err, cliente) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.status(201).json(cliente);
    });
};

exports.updateCliente = (req, res) => {
    const codigo = req.params.codigo;
    const clienteAtualizado = req.body;
    Cliente.update(codigo, clienteAtualizado, (err) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ message: 'Cliente atualizado com sucesso' });
    });
};

exports.deleteCliente = (req, res) => {
    const codigo = req.params.codigo;
    Cliente.delete(codigo, (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Cliente deletado com sucesso' });
    });
};