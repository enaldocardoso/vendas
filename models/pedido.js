const db = require('../db/database');

class Pedido {
    static getAll(callback) {
        db.all('SELECT * FROM pedidos', callback);
    }

    static getById(codigo, callback) {
        db.get('SELECT * FROM pedidos WHERE codigo = ?', [codigo], callback);
    }

    static create(pedido, callback) {
        const { codigoCliente, valorTotal } = pedido;
        db.run(
            'INSERT INTO pedidos (codigoCliente, valorTotal) VALUES (?, ?)',
            [codigoCliente, valorTotal],
            function(err) {
                callback(err, { ...pedido, codigo: this.lastID });
            }
        );
    }

    static getItensByPedido(codigoPedido, callback) {
        db.all(
            'SELECT ip.*, p.nome as produtoNome FROM itens_pedido ip JOIN produtos p ON ip.codigoProduto = p.codigo WHERE ip.codigoPedido = ?',
            [codigoPedido],
            callback
        );
    }

    static addItem(codigoPedido, item, callback) {
        const { codigoProduto, valorUnitario, quantidade } = item;
        db.run(
            'INSERT INTO itens_pedido (codigoPedido, codigoProduto, valorUnitario, quantidade) VALUES (?, ?, ?, ?)',
            [codigoPedido, codigoProduto, valorUnitario, quantidade],
            callback
        );
    }

    static delete(codigo, callback) {
        db.serialize(() => {
            db.run('DELETE FROM itens_pedido WHERE codigoPedido = ?', [codigo]);
            db.run('DELETE FROM pedidos WHERE codigo = ?', [codigo], callback);
        });
    }
}

module.exports = Pedido;