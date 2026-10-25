const triviaModel = require('../models/triviaModel');
const memoramaModel = require('../models/memoramaModel');
const collectibleModel = require('../models/collectibleModel');

const TRIVIA_TEAM_COLLECTIBLES = {
    sultanes: 1,     // Bateador: Víctor Mendoza
    toros: 2,        // Bateador: Justin Turner
    charros: 3,      // Bateador: Kyle Garlick
    acereros: 4,     // Bateador: Ramón Hernández
    rieleros: 5,     // Bateador: Ángel Reyes
    saraperos: 6,    // Bateador: Fernando Villegas
    tecos: 7,        // Bateador: Kennys Vargas
    dorados: 8,      // Bateador: Juan Yépez
    algodoneros: 9,  // Bateador: Nick Torres
    caliente: 10,    // Bateador: Víctor Márquez
    calientes: 10,   // alias
    norteno: 11      // Lanzador: Juan Gámez (Desafío Norteño)
};

// GUARDAR RESULTADO DE TRIVIA Y EVALUAR RECOMPENSAS
async function saveTrivia(req, res) {
    try {
        const { id_usuario, trivia_key, puntaje, total_preguntas, porcentaje } = req.body;
        if (!id_usuario || !trivia_key) {
            return res.status(400).json({ error: 'Faltan datos de la partida.' });
        }

        const normalizedKey = trivia_key.toLowerCase();
        const scorePercent = Number(porcentaje) || ((Number(puntaje) / Number(total_preguntas)) * 100);
        const isPerfect = scorePercent >= 100 || (Number(puntaje) === Number(total_preguntas) && Number(total_preguntas) > 0);

        // Registrar partida en historial
        await triviaModel.saveHistory(id_usuario, normalizedKey, puntaje, total_preguntas, scorePercent);

        // Determinar coleccionables candidatos a desbloquear
        const candidateIds = [];

        // Hito ID 12: Primera Jugada (Responder y completar tu primera trivia con cualquier calificación)
        candidateIds.push(12);

        if (isPerfect) {
            // Coleccionable específico de equipo (IDs 1 al 11)
            const teamColId = TRIVIA_TEAM_COLLECTIBLES[normalizedKey];
            if (teamColId) {
                candidateIds.push(teamColId);
            }

            // Hito ID 26: Fanático de Corazón (100% en la trivia de tu equipo favorito)
            const favTeam = await triviaModel.getUserFavoriteTeam(id_usuario);
            if (favTeam) {
                const fav = favTeam.toLowerCase();
                if (fav === normalizedKey || (fav === 'caliente' && normalizedKey === 'calientes')) {
                    candidateIds.push(26);
                }
            }
        }

        // Hitos acumulativos:
        const totalUniques = await triviaModel.countUniqueTrivias(id_usuario);
        if (totalUniques >= 11) {
            // ID 13: Bateador Constante (completar las 11 trivias)
            candidateIds.push(13);
        }

        const totalPerfects = await triviaModel.countPerfectTrivias(id_usuario);
        if (totalPerfects >= 5) {
            // ID 14: Medio Camino a la Gloria (al menos 5 trivias al 100%)
            candidateIds.push(14);
        }
        if (totalPerfects >= 11) {
            // ID 15: Grand Slam del Saber (las 11 trivias al 100%)
            candidateIds.push(15);
        }

        // Otorgar los coleccionables candidatos que sean nuevos
        const newCollectibles = [];
        for (const cid of candidateIds) {
            const isNew = await collectibleModel.unlockCollectible(id_usuario, cid);
            if (isNew) {
                const colInfo = await collectibleModel.getCollectibleById(cid);
                if (colInfo) {
                    newCollectibles.push(colInfo);
                }
            }
        }

        res.json({
            success: true,
            message: 'Resultado de trivia registrado exitosamente.',
            newCollectibles
        });
    } catch (error) {
        console.error('Error en gameController.saveTrivia:', error);
        res.status(500).json({ error: error.message });
    }
}

// GUARDAR PARTIDA DE MEMORAMA Y EVALUAR RECOMPENSAS
async function saveMemorama(req, res) {
    try {
        const { id_usuario, dificultad, movimientos, tiempo_segundos, completado } = req.body;
        if (!id_usuario) {
            return res.status(400).json({ error: 'Faltan datos de la partida de memorama.' });
        }

        const isCompleted = completado !== false && completado !== 0;
        const diff = (dificultad || 'medio').toLowerCase();
        const moves = parseInt(movimientos, 10) || 0;
        const seconds = parseInt(tiempo_segundos, 10) || 0;

        // Guardar la partida en la base de datos
        await memoramaModel.saveGame(id_usuario, diff, moves, seconds, isCompleted);

        const candidateIds = [];

        // Evaluar criterios de coleccionables solo si la partida fue completada
        if (isCompleted) {
            // Victorias por nivel de dificultad
            if (diff === 'facil') candidateIds.push(16);   // ID 16: Zach Morth
            if (diff === 'medio') candidateIds.push(17);   // ID 17: Nate Antone
            if (diff === 'dificil') candidateIds.push(18); // ID 18: Darel Torres

            // Récords de velocidad (Tiempo)
            if (diff === 'facil' && seconds < 30) candidateIds.push(19);    // ID 19: Erasmo Ramírez
            if (diff === 'medio' && seconds < 60) candidateIds.push(20);    // ID 20: Odrisamer Despaigne
            if (diff === 'dificil' && seconds < 90) candidateIds.push(21);  // ID 21: Henry Blanco

            // Récords de precisión (Movimientos)
            if (diff === 'facil' && moves < 8) candidateIds.push(22);     // ID 22: Roberto Kelly
            if (diff === 'medio' && moves < 16) candidateIds.push(23);    // ID 23: Benjamín Gil

            // Hito Maestro: ID 24: Juan Gabriel Castro (Ganar en Fácil, Medio y Difícil)
            const wonDiffs = await memoramaModel.getCompletedDifficulties(id_usuario);
            if (wonDiffs.has('facil') && wonDiffs.has('medio') && wonDiffs.has('dificil')) {
                candidateIds.push(24);
            }

            // Hito de Racha: ID 27: Mendy López (Ganar 3 partidas consecutivas)
            const recentGames = await memoramaModel.getRecentGames(id_usuario, 3);
            if (recentGames.length >= 3 && recentGames.every(g => g.completado === 1 || g.completado === true)) {
                candidateIds.push(27);
            }
        }

        // Otorgar los coleccionables candidatos que sean nuevos
        const newCollectibles = [];
        for (const cid of candidateIds) {
            const isNew = await collectibleModel.unlockCollectible(id_usuario, cid);
            if (isNew) {
                const colInfo = await collectibleModel.getCollectibleById(cid);
                if (colInfo) {
                    newCollectibles.push(colInfo);
                }
            }
        }

        res.json({
            success: true,
            message: 'Partida de memorama registrada exitosamente.',
            newCollectibles
        });
    } catch (error) {
        console.error('Error en gameController.saveMemorama:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    saveTrivia,
    saveMemorama
};
