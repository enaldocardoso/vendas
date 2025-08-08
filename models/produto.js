const db = require('../db/database');

class Produto {
    static getAll(callback) {
        db.all('SELECT * FROM produtos', callback);
    }

    static getById(codigo, callback) {
        db.get('SELECT * FROM produtos WHERE codigo = ?', [codigo], callback);
    }

    static create(produto, callback) {
        const { nome, marca, grupo, valor, quantidadeEstoque } = produto;
        db.run(
            'INSERT INTO produtos (nome, marca, grupo, valor, quantidadeEstoque) VALUES (?, ?, ?, ?, ?)',
            [nome, marca, grupo, valor, quantidadeEstoque],
            function(err) {
                callback(err, { ...produto, codigo: this.lastID });
            }
        );
    }

    static update(codigo, produto, callback) {
        const { nome, marca, grupo, valor, quantidadeEstoque } = produto;
        db.run(
            'UPDATE produtos SET nome = ?, marca = ?, grupo = ?, valor = ?, quantidadeEstoque = ? WHERE codigo = ?',
            [nome, marca, grupo, valor, quantidadeEstoque, codigo],
            callback
        );
    }

    static delete(codigo, callback) {
        db.run('DELETE FROM produtos WHERE codigo = ?', [codigo], callback);
    }
}

module.exports = Produto;