require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '', // Default to empty string for local dev
    database: process.env.DB_NAME || 'projeto',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test Connection and Create Table
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Base de dados conectada com sucesso!');

        /* 
        // Comentado para NÃO alterar a estrutura do banco existente
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS \`usuarios\` (
              \`id\` BIGINT NOT NULL AUTO_INCREMENT,
              ... (mantendo estrutura original)
        `;
        await connection.query(createTableQuery);
        console.log('✅ Tabela usuarios verificada (criação ignorada).');
        */
        console.log('✅ Conexão estabelecida (Usando estrutura existente).');
        connection.release();
    } catch (err) {
        console.error('❌ Erro ao conectar ao banco de dados:', err);
    }
})();

// Routes
app.post('/submit', async (req, res) => {
    try {
        const { nome, email, telefone, mensagem } = req.body;

        console.log('Recebido:', { nome, email, telefone, mensagem });

        // Validation (Basic)
        if (!nome || !email) {
            return res.status(400).json({ error: 'Nome e Email são obrigatórios.' });
        }

        // Inserting into DB
        // 'mensagem' is not in schema, so we skip it.
        // 'senha' is required, using default '123456'.
        const query = `
            INSERT INTO usuarios (nome, email, telefone, senha)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await pool.execute(query, [nome, email, telefone, '123456']);

        res.status(201).json({ message: 'Dados recebidos e salvos com sucesso!', id: result.insertId });

    } catch (error) {
        console.error('Erro ao salvar dados:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email ou Documento já cadastrado.' });
        }
        // Send detailed error for debugging
        res.status(500).json({ error: `Erro no servidor: ${error.message || error.code}` });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
