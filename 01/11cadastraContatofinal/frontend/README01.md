# Resumo do Projeto: Formulário de Contato Full-Stack

Este documento descreve a arquitetura e o funcionamento de uma aplicação web full-stack de formulário de contato, construída com Node.js, Express, MySQL, e um frontend com HTML, CSS e JavaScript puro (utilizando Vite).

## 1. Visão Geral

A aplicação consiste em duas partes principais:

-   **Backend**: Um servidor Node.js que expõe uma API para receber e salvar os dados do formulário.
-   **Frontend**: Uma página web com um formulário de contato que envia os dados para o backend.

O projeto está estruturado na pasta `10/`, com as subpastas `backend/` e `frontend/`.

## 2. Backend (`10/backend/`)

O backend é responsável por processar as requisições do frontend, validar os dados e persisti-los em um banco de dados MySQL.

### 2.1. Tecnologias Utilizadas

-   **Node.js**: Ambiente de execução para o JavaScript no servidor.
-   **Express.js**: Framework para criar o servidor e as rotas da API.
-   **mysql2/promise**: Driver para conectar ao MySQL, utilizando a versão baseada em Promises para um código `async/await` mais limpo.
-   **dotenv**: Para gerenciar variáveis de ambiente (credenciais do banco de dados) de forma segura.
-   **cors**: Middleware para habilitar o Cross-Origin Resource Sharing, permitindo que o frontend (em um domínio/porta diferente) acesse a API.

### 2.2. Estrutura de Arquivos

```
10/backend/
├── app.js         # Arquivo principal do servidor
├── package.json   # Dependências e scripts do projeto
├── .env           # Arquivo de variáveis de ambiente (NÃO versionado)
└── schema.sql     # Script para criação do banco e da tabela
```

### 2.3. Funcionamento (`app.js`)

1.  **Inicialização**: O servidor importa as bibliotecas necessárias (`express`, `mysql2/promise`, `cors`, `dotenv`).
2.  **Configuração do Banco de Dados**:
    -   As credenciais do banco de dados são carregadas do arquivo `.env`.
    -   É criado um **Pool de Conexões** (`mysql.createPool`). Isso é mais eficiente do que criar uma nova conexão para cada requisição, pois reutiliza conexões existentes.
3.  **Middlewares**:
    -   `app.use(cors())`: Permite que o frontend, servido pelo Vite em `http://127.0.0.1:5173`, faça requisições para o backend em `http://localhost:3000`.
    -   `app.use(express.json())`: Habilita o servidor a interpretar o corpo das requisições que chegam no formato JSON.
4.  **Rota da API (`POST /submit`)**:
    -   Esta é a única rota da API, responsável por receber os dados do formulário.
    -   Usa um bloco `try...catch...finally` para garantir que a conexão do pool seja sempre liberada, mesmo em caso de erro.
    -   **Segurança**: Utiliza **consultas parametrizadas** (`connection.execute(sql, [values])`). Isso previne **SQL Injection**, pois os dados do usuário nunca são concatenados diretamente na string SQL.
    -   **Lógica**:
        1.  Obtém uma conexão do pool.
        2.  Extrai os dados (`nome`, `email`, `telefone`, `mensagem`) do corpo da requisição.
        3.  Executa a query `INSERT` para salvar os dados na tabela `contatos`.
        4.  Retorna uma resposta de sucesso (`status 201`) ou de erro (`status 500`).
        5.  A conexão é liberada de volta para o pool no bloco `finally`.

## 3. Frontend (`10/frontend/`)

O frontend é uma Single Page Application (SPA) criada com Vite, responsável pela interface do usuário.

### 3.1. Tecnologias Utilizadas

-   **Vite**: Ferramenta de build moderna que oferece um servidor de desenvolvimento rápido.
-   **HTML5**: Estrutura do formulário.
-   **CSS3**: Estilização com design moderno (Glassmorphism, Flexbox, gradientes animados).
-   **JavaScript (ES6+)**: Lógica para capturar os dados do formulário e enviá-los para o backend via `fetch`.

### 3.2. Estrutura de Arquivos

```
10/frontend/
├── index.html     # Estrutura principal da página
├── style.css      # Arquivo de estilização
├── main.js        # Lógica de submissão do formulário
└── package.json   # Dependências do Vite
```

### 3.3. Funcionamento

1.  **`index.html`**: Define o formulário com os campos `nome`, `email`, `telefone`, `mensagem` e um botão de envio. Inclui um `div` para exibir mensagens de status (sucesso ou erro).
2.  **`style.css`**:
    -   Utiliza Flexbox para centralizar o conteúdo.
    -   Cria um fundo com gradiente animado.
    -   Aplica o efeito de **Glassmorphism** (vidro fosco) ao contêiner do formulário.
    -   Garante que o design seja responsivo.
3.  **`main.js`**:
    -   Adiciona um "escutador de eventos" (`addEventListener`) ao formulário para interceptar o evento de `submit`.
    -   Previne o comportamento padrão do formulário (que recarregaria a página) com `event.preventDefault()`.
    -   Coleta os valores dos campos do formulário.
    -   Usa a API `fetch` para enviar os dados como uma requisição `POST` para `http://localhost:3000/submit`.
    -   Define o `Content-Type` como `application/json`.
    -   Converte o objeto de dados em uma string JSON com `JSON.stringify()`.
    -   **Manipulação da Resposta**:
        -   Se a resposta do servidor for bem-sucedida (`response.ok`), exibe uma mensagem de sucesso e limpa o formulário.
        -   Caso contrário, exibe uma mensagem de erro.

## 4. Como Executar o Projeto

1.  **Backend**:
    -   Navegue até a pasta `10/backend`.
    -   Crie o arquivo `.env` com as suas credenciais do MySQL.
    -   Execute `npm install` para instalar as dependências.
    -   Execute `node app.js` para iniciar o servidor.

2.  **Frontend**:
    -   Navegue até a pasta `10/frontend`.
    -   Execute `npm install` para instalar o Vite.
    -   Execute `npm run dev` para iniciar o servidor de desenvolvimento.
    -   Acesse a URL fornecida pelo Vite (geralmente `http://127.0.0.1:5173`) no seu navegador.
