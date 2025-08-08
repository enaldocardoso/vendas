const db = require('../db/database');

class Cliente {
    static getAll(callback) {
        db.all('SELECT * FROM clientes', callback);
    }

    static getById(codigo, callback) {
        db.get('SELECT * FROM clientes WHERE codigo = ?', [codigo], callback);
    }

    static create(cliente, callback) {
        const { nome, email, cpf, cep, cidade, estado, endereco, complemento } = cliente;
        db.run(
            'INSERT INTO clientes (nome, email, cpf, cep, cidade, estado, endereco, complemento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [nome, email, cpf, cep, cidade, estado, endereco, complemento],
            function(err) {
                callback(err, { ...cliente, codigo: this.lastID });
            }
        );
    }

    static update(codigo, cliente, callback) {
        const { nome, email, cpf, cep, cidade, estado, endereco, complemento } = cliente;
        db.run(
            'UPDATE clientes SET nome = ?, email = ?, cpf = ?, cep = ?, cidade = ?, estado = ?, endereco = ?, complemento = ? WHERE codigo = ?',
            [nome, email, cpf, cep, cidade, estado, endereco, complemento, codigo],
            callback
        );
    }

    static delete(codigo, callback) {
        db.run('DELETE FROM clientes WHERE codigo = ?', [codigo], callback);
    }
}

module.exports = Cliente;