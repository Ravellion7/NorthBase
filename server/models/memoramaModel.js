const { pool } = require('../config/db');

async function saveGame(userId, dificultad, movimientos, tiempoSegundos, isCompleted) {
    const [result] = await pool.query(
        `INSERT INTO partidas_memorama (id_usuario, dificultad, movimientos, tiempo_segundos, completado)
         VALUES (?, ?, ?, ?, ?)`,
        [userId, dificultad, movimientos, tiempoSegundos, isCompleted ? 1 : 0]
    );
    return result.insertId;
}

async function getCompletedDifficulties(userId) {
    const [rows] = await pool.query(
        `SELECT DISTINCT dificultad FROM partidas_memorama WHERE id_usuario = ? AND completado = 1`,
        [userId]
    );
    return new Set(rows.map(r => r.dificultad.toLowerCase()));
}

async function getRecentGames(userId, limit = 3) {
    const [rows] = await pool.query(
        `SELECT completado FROM partidas_memorama WHERE id_usuario = ? ORDER BY id_partida DESC LIMIT ?`,
        [userId, limit]
    );
    return rows;
}

module.exports = {
    saveGame,
    getCompletedDifficulties,
    getRecentGames
};
