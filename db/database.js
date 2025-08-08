const sqlite3 = require('sqlite3').verbose();
const path = require('path');

//const DB_PATH = path.resolve(__dirname, '../database.db');
const DB_PATH = path.resolve(__dirname, '../db/database.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err.message);
    } else {
        console.log('Conectado ao banco de dados SQLite');
        initializeDatabase();
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Criar tabela de produtos
        db.run(`CREATE TABLE IF NOT EXISTS produtos (
            codigo INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            marca TEXT,
            grupo TEXT,
            valor REAL NOT NULL,
            quantidadeEstoque INTEGER NOT NULL DEFAULT 0
        )`);

        // Criar tabela de clientes
        db.run(`CREATE TABLE IF NOT EXISTS clientes (
            codigo INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT,
            cpf TEXT UNIQUE,
            cep TEXT,
            cidade TEXT,
            estado TEXT,
            endereco TEXT,
            complemento TEXT
        )`);

        // Criar tabela de pedidos
        db.run(`CREATE TABLE IF NOT EXISTS pedidos (
            codigo INTEGER PRIMARY KEY AUTOINCREMENT,
            dataPedido TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
            codigoCliente INTEGER NOT NULL,
            valorTotal REAL NOT NULL,
            FOREIGN KEY (codigoCliente) REFERENCES clientes(codigo)
        )`);

        // Criar tabela de itens do pedido
        db.run(`CREATE TABLE IF NOT EXISTS itens_pedido (
            codigo INTEGER PRIMARY KEY AUTOINCREMENT,
            codigoPedido INTEGER NOT NULL,
            codigoProduto INTEGER NOT NULL,
            valorUnitario REAL NOT NULL,
            quantidade INTEGER NOT NULL,
            FOREIGN KEY (codigoPedido) REFERENCES pedidos(codigo),
            FOREIGN KEY (codigoProduto) REFERENCES produtos(codigo)
        )`);
    });
}

module.exports = db;