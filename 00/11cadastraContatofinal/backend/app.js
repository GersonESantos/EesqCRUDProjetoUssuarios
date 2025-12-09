// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

const express = require('express');
const mysql = require('mysql2/promise'); // Usando a versão com Promises para um código mais limpo (async/await)
const cors = require('cors'); // Middleware para permitir requisições de outras origens

// --- Configuração do Pool de Conexões ---
// Usar um pool de conexões é a melhor prática para aplicações web, 
// pois gerencia múltiplas conexões de forma eficiente e evita gargalos.
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10, // Número máximo de conexões no pool
    queueLimit: 0 // Fila de espera ilimitada
});

// Inicializa o aplicativo Express
const app = express();
const PORT = process.env.PORT || 3000;

// --- Middlewares ---
// Habilita o CORS (Cross-Origin Resource Sharing) para permitir que o frontend,
// que rodará em http://localhost:5173, possa fazer requisições para este backend.
app.use(cors({
    origin: 'http://localhost:5173' 
}));

// Habilita o Express para interpretar o corpo das requisições que chegam em formato JSON.
app.use(express.json());


// --- Rotas da API ---

// Rota de verificação de saúde da API (Health Check)
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Backend do Conecta Banco Formulário está no ar e pronto para receber requisições.' });
});

/**
 * Rota para submeter os dados do formulário.
 * Recebe os dados via POST, valida e insere no banco de dados.
 */
app.post('/submit', async (req, res) => {
    const { nome, email, telefone, mensagem } = req.body;

    // Validação de entrada: Garante que os campos essenciais não são nulos ou vazios.
    if (!nome || !email || !mensagem) {
        return res.status(400).json({ success: false, message: 'Nome, e-mail e mensagem são campos obrigatórios.' });
    }

    let connection;
    try {
        // Pega uma conexão do pool. O 'await' espera uma conexão ficar disponível.
        connection = await pool.getConnection();
        
        // A query SQL é parametrizada com '?' para prevenir SQL Injection.
        const sql = 'INSERT INTO contatos (nome, email, telefone, mensagem) VALUES (?, ?, ?, ?)';
        const values = [nome, email, telefone, mensagem];

        // Executa a query de forma segura.
        const [result] = await connection.execute(sql, values);
        
        res.status(201).json({ success: true, message: 'Mensagem enviada com sucesso!', insertedId: result.insertId });

    } catch (error) {
        // Em caso de erro no banco de dados, loga o erro no console do servidor
        // e retorna uma resposta de erro genérica para o cliente.
        console.error('Erro ao inserir dados no banco de dados:', error);
        res.status(500).json({ success: false, message: 'Ocorreu um erro no servidor ao processar sua solicitação.' });

    } finally {
        // Garante que a conexão seja devolvida ao pool, estando disponível para a próxima requisição.
        if (connection) {
            connection.release();
        }
    }
});

// --- Inicialização do Servidor ---
app.listen(PORT, () => {
    console.log(`Backend completo e rodando na porta ${PORT}`);
});
