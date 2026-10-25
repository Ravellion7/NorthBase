const { pool } = require('../config/db');

async function saveHistory(userId, triviaKey, puntaje, totalPreguntas, scorePercent) {
    const [result] = await pool.query(
        `INSERT INTO historial_trivias (id_usuario, trivia_key, puntaje, total_preguntas, porcentaje)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, triviaKey, puntaje, totalPreguntas, scorePercent]
    );
    return result.insertId;
}

async function getUserFavoriteTeam(userId) {
    const [rows] = await pool.query(
        `SELECT equipo_favorito FROM usuarios WHERE id_usuario = ?`,
        [userId]
    );
    return rows.length > 0 ? rows[0].equipo_favorito : null;
}

async function countUniqueTrivias(userId) {
    const [rows] = await pool.query(
        `SELECT COUNT(DISTINCT trivia_key) AS total_uniques FROM historial_trivias WHERE id_usuario = ?`,
        [userId]
    );
    return rows[0]?.total_uniques || 0;
}

async function countPerfectTrivias(userId) {
    const [rows] = await pool.query(
        `SELECT COUNT(DISTINCT trivia_key) AS total_perfects 
         FROM historial_trivias 
         WHERE id_usuario = ? AND (porcentaje >= 100 OR puntaje = total_preguntas)`,
        [userId]
    );
    return rows[0]?.total_perfects || 0;
}

module.exports = {
    saveHistory,
    getUserFavoriteTeam,
    countUniqueTrivias,
    countPerfectTrivias
};
