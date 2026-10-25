const { pool } = require('../config/db');

async function getUserCollectibles(userId) {
    const [rows] = await pool.query(
        `SELECT c.*, uc.fecha_desbloqueo 
         FROM usuario_coleccionables uc
         JOIN coleccionables c ON uc.id_coleccionable = c.id_coleccionable
         WHERE uc.id_usuario = ?
         ORDER BY uc.fecha_desbloqueo DESC`,
        [userId]
    );
    return rows;
}

async function unlockCollectible(userId, collectibleId) {
    const [result] = await pool.query(
        `INSERT IGNORE INTO usuario_coleccionables (id_usuario, id_coleccionable) 
         VALUES (?, ?)`,
        [userId, collectibleId]
    );
    return result.affectedRows > 0;
}

async function getCollectibleById(collectibleId) {
    const [rows] = await pool.query(
        `SELECT id_coleccionable, nombre, descripcion, tipo, imagen_url 
         FROM coleccionables 
         WHERE id_coleccionable = ?`,
        [collectibleId]
    );
    return rows.length > 0 ? rows[0] : null;
}

module.exports = {
    getUserCollectibles,
    unlockCollectible,
    getCollectibleById
};
