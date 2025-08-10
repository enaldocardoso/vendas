const Pedido = require('../models/pedido');
const Produto = require('../models/produto');

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
    
    // Primeiro verifica o estoque de todos os itens
    verificarEstoque(itens)
        .then(() => {
            // Calcula o valor total
            const valorTotal = itens.reduce((total, item) => {
                return total + (item.valorUnitario * item.quantidade);
            }, 0);
            
            const novoPedido = { codigoCliente, valorTotal };
            
            // Cria o pedido
            Pedido.create(novoPedido, (err, pedido) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                
                const codigoPedido = pedido.codigo;
                
                // Adiciona os itens do pedido e atualiza o estoque
                const addItems = itens.map(item => {
                    return new Promise((resolve, reject) => {
                        // Adiciona item ao pedido
                        Pedido.addItem(codigoPedido, item, (err) => {
                            if (err) return reject(err);
                            
                            // Atualiza o estoque
                            Produto.getById(item.codigoProduto, (err, produto) => {
                                if (err) return reject(err);
                                
                                const novoEstoque = produto.quantidadeEstoque - item.quantidade;
                                Produto.update(item.codigoProduto, { 
                                    ...produto, 
                                    quantidadeEstoque: novoEstoque 
                                }, (err) => {
                                    if (err) reject(err);
                                    else resolve();
                                });
                            });
                        });
                    });
                });
                
                Promise.all(addItems)
                    .then(() => {
                        res.status(201).json({ 
                            message: 'Pedido criado com sucesso e estoque atualizado',
                            pedido: { ...pedido, itens } 
                        });
                    })
                    .catch(error => {
                        res.status(500).json({ error: error.message });
                    });
            });
        })
        .catch(error => {
            res.status(400).json({ error: error.message });
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

// Função auxiliar para verificar o estoque
function verificarEstoque(itens) {
    return new Promise((resolve, reject) => {
        const verificacoes = itens.map(item => {
            return new Promise((resolveItem, rejectItem) => {
                Produto.getById(item.codigoProduto, (err, produto) => {
                    if (err) return rejectItem(err);
                    
                    if (!produto) {
                        return rejectItem(new Error(`Produto com código ${item.codigoProduto} não encontrado`));
                    }
                    
                    if (produto.quantidadeEstoque < item.quantidade) {
                        return rejectItem(new Error(
                            `Estoque insuficiente para o produto ${produto.nome}. ` +
                            `Quantidade solicitada: ${item.quantidade}, ` +
                            `estoque disponível: ${produto.quantidadeEstoque}`
                        ));
                    }
                    
                    if (item.quantidade <= 0) {
                        return rejectItem(new Error(
                            `Quantidade inválida para o produto ${produto.nome}. ` +
                            `A quantidade deve ser maior que zero`
                        ));
                    }
                    
                    resolveItem();
                });
            });
        });
        
        Promise.all(verificacoes)
            .then(() => resolve())
            .catch(err => reject(err));
    });
}