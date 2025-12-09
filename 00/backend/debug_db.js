require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'projeto',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Conexão OK');

        // 1. Describe Table
        const [rows] = await connection.query('DESCRIBE usuarios');
        console.log('\n🔍 Estrutura da Tabela usuarios:');
        console.table(rows);

        // 2. Test Insert
        console.log('\n🧪 Testando Insert...');
        try {
            const [result] = await connection.execute(
                'INSERT INTO usuarios (nome, email, telefone, senha) VALUES (?, ?, ?, ?)',
                ['Teste Debug', `debug_${Date.now()}@test.com`, '11999999999', '123456']
            );
            console.log('✅ Insert funcionou! ID:', result.insertId);
        } catch (insertError) {
            console.error('❌ Falha no Insert:', insertError.message);
            console.error('Code:', insertError.code);
            console.error('Full Error:', insertError);
        }

        connection.release();
        process.exit();
    } catch (err) {
        console.error('❌ Erro Fatal:', err);
        process.exit(1);
    }
})();
