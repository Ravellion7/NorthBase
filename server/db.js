const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'northbase_db',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Probar conexión inicial
async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log(`✅ Conexión exitosa a la base de datos MySQL: "${process.env.DB_NAME || 'northbase_db'}"`);
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos MySQL:', error.message);
        console.error('💡 Verifica que MySQL esté iniciado (XAMPP/Workbench) y los datos en tu archivo .env sean correctos.');
        return false;
    }
}

module.exports = {
    pool,
    testConnection
};
