# Resumo do Projeto: Formulário de Contato Full-Stack (React + Node.js)

Este projeto é uma aplicação web full-stack projetada para capturar e armazenar dados de um formulário de contato. Ele é dividido em duas partes principais: um **frontend** desenvolvido com React e um **backend** construído com Node.js e Express.

### Arquitetura Geral

*   **Frontend**: Uma interface de usuário moderna criada com **React** e empacotada com **Vite**. É responsável por renderizar o formulário de contato e enviar os dados preenchidos pelo usuário para o backend.
*   **Backend**: Um servidor **Node.js** utilizando o framework **Express.js**. Ele expõe uma API RESTful para receber, validar e persistir os dados do formulário.
*   **Banco de Dados**: Um banco de dados **MySQL** é usado para armazenar as informações de contato enviadas. O script `data/schema.sql` define a estrutura da tabela `contatos`.

### Detalhes do Backend (`/backend`)

*   **Servidor**: `app.js` configura um servidor Express que escuta por requisições.
*   **API**: Expõe uma rota principal `POST /submit` que recebe os dados do formulário (nome, email, telefone, mensagem).
*   **Conexão com Banco de Dados**: Utiliza a biblioteca `mysql2/promise` com um pool de conexões para gerenciar a comunicação com o MySQL de forma eficiente e segura.
*   **Segurança**:
    *   As credenciais do banco de dados são gerenciadas de forma segura através de variáveis de ambiente com o pacote `dotenv`.
    *   Previne ataques de SQL Injection utilizando queries parametrizadas.
*   **CORS**: O middleware `cors` é configurado para permitir que o frontend (rodando em um servidor de desenvolvimento separado) possa se comunicar com a API do backend.

### Detalhes do Frontend (`/frontend`)

*   **Framework**: Construído com **React**, permitindo uma interface de usuário dinâmica e reativa.
*   **Build Tool**: **Vite** é utilizado para um desenvolvimento rápido e um processo de build otimizado.
*   **Funcionalidade**: O componente principal `App.jsx` é o ponto de entrada da aplicação. A lógica para enviar os dados do formulário para o endpoint `/submit` do backend será implementada aqui.

### Como Executar o Projeto

1.  **Configurar o Banco de Dados**:
    *   Execute o script em `data/schema.sql` no seu servidor MySQL para criar o banco de dados `formulario` e a tabela `contatos`.

2.  **Executar o Backend**:
    *   Navegue até a pasta `backend`.
    *   Crie um arquivo `.env` com as credenciais do seu banco de dados (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME).
    *   Execute `npm install` para instalar as dependências.
    *   Inicie o servidor com `npm start`.

3.  **Executar o Frontend**:
    *   Navegue até a pasta `frontend`.
    *   Execute `npm install` para instalar as dependências.
    *   Inicie o servidor de desenvolvimento com `npm run dev`.
    *   Acesse a aplicação no seu navegador através do endereço fornecido pelo Vite.
