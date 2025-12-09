-- Garante que o banco de dados 'formulario' exista antes de tentar usá-lo.
-- Se o banco de dados não existir, ele será criado.
CREATE DATABASE IF NOT EXISTS formulario;

-- Seleciona o banco de dados 'formulario' para as operações seguintes.
USE formulario;

-- Cria a tabela 'contatos' se ela ainda não existir.
-- Esta tabela armazenará as submissões do formulário de contato.
CREATE TABLE IF NOT EXISTS contatos (
    -- 'id' é a chave primária da tabela. É um número inteiro,
    -- não pode ser nulo e se auto-incrementa a cada novo registro.
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    -- 'nome' armazena o nome do remetente. VARCHAR(255) é um bom tamanho padrão.
    -- NOT NULL garante que este campo não pode ficar vazio.
    nome VARCHAR(255) NOT NULL,
    
    -- 'email' armazena o e-mail do remetente.
    -- NOT NULL garante que este campo é obrigatório.
    email VARCHAR(255) NOT NULL,
    
    -- 'telefone' é opcional, por isso não tem 'NOT NULL'.
    telefone VARCHAR(20),
    
    -- 'mensagem' armazena o conteúdo da mensagem.
    -- TEXT é usado para textos mais longos, sem um limite fixo de caracteres.
    -- NOT NULL garante que a mensagem não pode estar vazia.
    mensagem TEXT NOT NULL,
    
    -- 'data_envio' registra automaticamente a data e a hora em que
    -- o registro foi inserido no banco de dados.
    -- DEFAULT CURRENT_TIMESTAMP faz o trabalho pesado para nós.
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
