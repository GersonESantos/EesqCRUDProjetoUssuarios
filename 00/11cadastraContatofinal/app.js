const express = require('express');
const mysql = require('mysql2');
const path = require('path'); // Adicionado

const app = express();

// ... (código de conexão com o banco, que já sabemos que funciona) ...
Conexao.connect(function(err){
    if(err) throw err;
    console.log('Conectado com sucesso!');
});

// Rota principal para servir o index.html
app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Servidor
app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
});