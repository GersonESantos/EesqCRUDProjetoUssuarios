require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/submit', async (req, res) => {
  const {
    nome,
    email,
    telefone,
    documento,
    senha,
    sexo,
    data_nasc,
    endereco,
    cidade,
    estado,
  } = req.body;

  // Validação simples dos dados recebidos
  if (!nome || !email || !senha || !documento) {
    return res.status(400).json({ error: 'Campos obrigatórios não preenchidos.' });
  }

  try {
    const connection = await db.getConnection();
    const [result] = await connection.execute(
      `INSERT INTO usuarios (nome, email, telefone, documento, senha, sexo, data_nasc, endereco, cidade, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, email, telefone, documento, senha, sexo, data_nasc, endereco, cidade, estado]
    );
    connection.release();
    res.status(201).json({ success: true, userId: result.insertId });
  } catch (error) {
    console.error('Erro ao salvar no banco de dados:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

app.listen(port, () => {
  console.log(`Backend rodando na porta ${port}`);
});
