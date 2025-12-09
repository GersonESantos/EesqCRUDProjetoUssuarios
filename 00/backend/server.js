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

        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS \`usuarios\` (
              \`id\` BIGINT NOT NULL AUTO_INCREMENT,
              \`nome\` VARCHAR(100) NOT NULL,
              \`email\` VARCHAR(150) NOT NULL,
              \`telefone\` VARCHAR(15) NULL DEFAULT NULL,
              \`documento\` VARCHAR(14) NULL DEFAULT NULL,
              \`senha\` VARCHAR(255) NOT NULL,
              \`sexo\` VARCHAR(20) NULL DEFAULT NULL,
              \`data_nasc\` DATE NULL DEFAULT NULL,
              \`endereco\` VARCHAR(255) NULL DEFAULT NULL,
              \`cidade\` VARCHAR(100) NULL DEFAULT NULL,
              \`estado\` VARCHAR(2) NULL DEFAULT NULL,
              \`status\` VARCHAR(50) NOT NULL DEFAULT 'Ativo',
              \`tipo_usuario\` VARCHAR(50) NOT NULL DEFAULT 'Cliente',
              \`data_cadastro\` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
              \`newsletter\` TINYINT(1) NOT NULL DEFAULT '1',
              \`notificacoes_push\` TINYINT(1) NOT NULL DEFAULT '1',
              \`idioma\` VARCHAR(10) NOT NULL DEFAULT 'pt-BR',
              \`nivel_experiencia\` VARCHAR(50) NULL DEFAULT NULL,
              PRIMARY KEY (\`id\`),
              UNIQUE INDEX \`email\` (\`email\` ASC) VISIBLE,
              UNIQUE INDEX \`documento\` (\`documento\` ASC) VISIBLE)
            ENGINE = InnoDB
            DEFAULT CHARACTER SET = utf8mb4
            COLLATE = utf8mb4_0900_ai_ci;
        `;

        await connection.query(createTableQuery);
        console.log('✅ Tabela usuarios verificada/criada.');
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
            return res.status(409).json({ error: 'Email já cadastrado.' });
        }
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
