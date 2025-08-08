const Pedido = require('../models/pedido');

exports.getAllPedidos = (req, res) => {
    Pedido.getAll((err, pedidos) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(pedidos);
    });
};

exports.getPedidoById = (req, res) => {
    const codigo = req.params.codigo;
    Pedido.getById(codigo, (err, pedido) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!pedido) {
            res.status(404).json({ error: 'Pedido não encontrado' });
            return;
        }
        
        // Busca os itens do pedido
        Pedido.getItensByPedido(codigo, (err, itens) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ ...pedido, itens });
        });
    });
};

exports.createPedido = (req, res) => {
    const { codigoCliente, itens } = req.body;
    
    // Calcula o valor total
    const valorTotal = itens.reduce((total, item) => {
        return total + (item.valorUnitario * item.quantidade);
    }, 0);
    
    const novoPedido = { codigoCliente, valorTotal };
    
    Pedido.create(novoPedido, (err, pedido) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        
        // Adiciona os itens do pedido
        const codigoPedido = pedido.codigo;
        const addItems = itens.map(item => {
            return new Promise((resolve, reject) => {
                Pedido.addItem(codigoPedido, item, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        });
        
        Promise.all(addItems)
            .then(() => {
                res.status(201).json({ ...pedido, itens });
            })
            .catch(error => {
                res.status(500).json({ error: error.message });
            });
    });
};

exports.deletePedido = (req, res) => {
    const codigo = req.params.codigo;
    Pedido.delete(codigo, (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Pedido deletado com sucesso' });
    });
};