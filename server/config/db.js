const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const dbHost = process.env.DB_HOST || 'localhost';
const isCloudHost = dbHost !== 'localhost' && dbHost !== '127.0.0.1';

const poolConfig = {
    host: dbHost,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'northbase_db',
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

// Activar SSL seguro automáticamente para proveedores en la nube (Aiven, TiDB, Railway, Supabase)
if (process.env.DB_SSL === 'true' || isCloudHost) {
    poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = mysql.createPool(poolConfig);

async function testConnection() {
    try {
        const connection = await pool.getConnection();
        console.log(`✅ Conexión exitosa a la base de datos MySQL: "${process.env.DB_NAME || 'northbase_db'}"`);
        connection.release();
        return true;
    } catch (error) {
        console.error('Error al conectar con la base de datos MySQL:', error.message);
        console.error('Verifica que MySQL esté iniciado (XAMPP/Workbench) y los datos en tu archivo .env sean correctos.');
        return false;
    }
}

module.exports = {
    pool,
    testConnection
};
