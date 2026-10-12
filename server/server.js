const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const path = require('path');
const { pool, testConnection } = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'northbase_secret_key_default';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

// Detectar dinámicamente las columnas de la tabla usuarios para máxima compatibilidad
async function getUserTableColumns() {
    try {
        const [rows] = await pool.query(
            "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'usuarios'",
            [process.env.DB_NAME || 'northbase_db']
        );
        return new Set(rows.map(r => r.COLUMN_NAME.toLowerCase()));
    } catch (error) {
        console.warn('No se pudieron leer las columnas de usuarios dinámicamente:', error.message);
        return new Set(['id_usuario', 'nombre_usuario', 'email', 'password_hash', 'equipo_favorito']);
    }
}

// Ruta de Salud
app.get('/api/health', async (req, res) => {
    res.json({
        status: 'ok',
        message: 'Servidor NorthBase API activo y funcionando.',
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// AUTENTICACIÓN
// ==========================================

// 1. REGISTRO
app.post('/api/auth/register', async (req, res) => {
    try {
        const {
            name,
            father_last_name,
            mother_last_name,
            email,
            password,
            favorite_team
        } = req.body;

        // Validaciones básicas
        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Faltan campos obligatorios (nombre, correo o contraseña).'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Verificar si el correo ya está registrado
        const [existing] = await pool.query(
            'SELECT id_usuario FROM usuarios WHERE email = ?',
            [cleanEmail]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                error: 'El correo electrónico ya se encuentra registrado.'
            });
        }

        // Cifrar la contraseña con bcrypt
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Inspeccionar columnas de la tabla del usuario
        const cols = await getUserTableColumns();

        const insertFields = [];
        const insertPlaceholders = [];
        const insertValues = [];

        // Soporte tanto para nombre_usuario como para nombre / apellidos
        if (cols.has('nombre')) {
            insertFields.push('nombre');
            insertPlaceholders.push('?');
            insertValues.push(name.trim());
        }
        if (cols.has('apellido_paterno')) {
            insertFields.push('apellido_paterno');
            insertPlaceholders.push('?');
            insertValues.push(father_last_name ? father_last_name.trim() : null);
        }
        if (cols.has('apellido_materno')) {
            insertFields.push('apellido_materno');
            insertPlaceholders.push('?');
            insertValues.push(mother_last_name ? mother_last_name.trim() : null);
        }
        if (cols.has('nombre_usuario')) {
            const username = [name, father_last_name].filter(Boolean).join(' ').trim();
            insertFields.push('nombre_usuario');
            insertPlaceholders.push('?');
            insertValues.push(username);
        }

        // Campos comunes
        insertFields.push('email', 'password_hash');
        insertPlaceholders.push('?', '?');
        insertValues.push(cleanEmail, passwordHash);

        if (cols.has('equipo_favorito')) {
            insertFields.push('equipo_favorito');
            insertPlaceholders.push('?');
            insertValues.push(favorite_team || null);
        }

        const sql = `INSERT INTO usuarios (${insertFields.join(', ')}) VALUES (${insertPlaceholders.join(', ')})`;
        const [result] = await pool.query(sql, insertValues);

        const newUserId = result.insertId;

        // Generar Token JWT
        const token = jwt.sign(
            { id_usuario: newUserId, email: cleanEmail },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente.',
            token,
            user: {
                id_usuario: newUserId,
                nombre: name,
                email: cleanEmail,
                equipo_favorito: favorite_team || null
            }
        });
    } catch (error) {
        console.error('Error en /api/auth/register:', error);
        res.status(500).json({
            error: 'Ocurrió un error en el servidor al intentar registrar el usuario.',
            details: error.message
        });
    }
});

// 2. INICIO DE SESIÓN
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Por favor ingresa tu correo y contraseña.'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        // Buscar al usuario
        const [users] = await pool.query(
            'SELECT * FROM usuarios WHERE email = ?',
            [cleanEmail]
        );

        if (users.length === 0) {
            return res.status(401).json({
                error: 'Correo electrónico o contraseña incorrectos.'
            });
        }

        const user = users[0];

        // Comparar contraseñas cifradas
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                error: 'Correo electrónico o contraseña incorrectos.'
            });
        }

        // Nombre para mostrar
        const displayName = user.nombre || user.nombre_usuario || user.email.split('@')[0];

        // Generar Token JWT
        const token = jwt.sign(
            { id_usuario: user.id_usuario, email: user.email },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Inicio de sesión exitoso.',
            token,
            user: {
                id_usuario: user.id_usuario,
                nombre: displayName,
                email: user.email,
                equipo_favorito: user.equipo_favorito || null
            }
        });
    } catch (error) {
        console.error('Error en /api/auth/login:', error);
        res.status(500).json({
            error: 'Ocurrió un error en el servidor al intentar iniciar sesión.',
            details: error.message
        });
    }
});

// 3. OBTENER DETALLE DEL USUARIO
app.get('/api/auth/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [users] = await pool.query(
            'SELECT * FROM usuarios WHERE id_usuario = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const user = users[0];
        delete user.password_hash;

        res.json({ user });
    } catch (error) {
        console.error('Error en /api/auth/user/:id:', error);
        res.status(500).json({ error: error.message });
    }
});

// 4. ACTUALIZAR PERFIL
app.put('/api/auth/profile', async (req, res) => {
    try {
        const {
            id_usuario,
            name,
            father_last_name,
            mother_last_name,
            email,
            password,
            favorite_team
        } = req.body;

        if (!id_usuario) {
            return res.status(400).json({ error: 'Falta el identificador del usuario.' });
        }

        const [users] = await pool.query(
            'SELECT * FROM usuarios WHERE id_usuario = ?',
            [id_usuario]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const currentUser = users[0];
        const cleanEmail = email ? email.trim().toLowerCase() : currentUser.email;

        if (cleanEmail !== currentUser.email) {
            const [existing] = await pool.query(
                'SELECT id_usuario FROM usuarios WHERE email = ? AND id_usuario != ?',
                [cleanEmail, id_usuario]
            );
            if (existing.length > 0) {
                return res.status(409).json({ error: 'El nuevo correo ya está en uso por otra cuenta.' });
            }
        }

        const cols = await getUserTableColumns();
        const updateFields = [];
        const updateValues = [];

        if (cols.has('nombre') && name !== undefined) {
            updateFields.push('nombre = ?');
            updateValues.push(name.trim());
        }
        if (cols.has('apellido_paterno') && father_last_name !== undefined) {
            updateFields.push('apellido_paterno = ?');
            updateValues.push(father_last_name ? father_last_name.trim() : null);
        }
        if (cols.has('apellido_materno') && mother_last_name !== undefined) {
            updateFields.push('apellido_materno = ?');
            updateValues.push(mother_last_name ? mother_last_name.trim() : null);
        }
        if (cols.has('nombre_usuario')) {
            const username = [name, father_last_name].filter(Boolean).join(' ').trim();
            if (username) {
                updateFields.push('nombre_usuario = ?');
                updateValues.push(username);
            }
        }

        if (cleanEmail) {
            updateFields.push('email = ?');
            updateValues.push(cleanEmail);
        }

        if (cols.has('equipo_favorito') && favorite_team !== undefined) {
            updateFields.push('equipo_favorito = ?');
            updateValues.push(favorite_team || null);
        }

        if (password && password.trim().length > 0) {
            const passwordHash = await bcrypt.hash(password.trim(), 10);
            updateFields.push('password_hash = ?');
            updateValues.push(passwordHash);
        }

        if (updateFields.length > 0) {
            updateValues.push(id_usuario);
            const sql = `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id_usuario = ?`;
            await pool.query(sql, updateValues);
        }

        const [updatedRows] = await pool.query(
            'SELECT * FROM usuarios WHERE id_usuario = ?',
            [id_usuario]
        );
        const updatedUser = updatedRows[0];
        delete updatedUser.password_hash;

        const displayName = updatedUser.nombre || updatedUser.nombre_usuario || updatedUser.email.split('@')[0];

        res.json({
            message: 'Perfil actualizado exitosamente.',
            user: {
                id_usuario: updatedUser.id_usuario,
                nombre: displayName,
                email: updatedUser.email,
                equipo_favorito: updatedUser.equipo_favorito || null,
                apellido_paterno: updatedUser.apellido_paterno || null,
                apellido_materno: updatedUser.apellido_materno || null
            }
        });
    } catch (error) {
        console.error('Error en /api/auth/profile:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// COLECCIONABLES Y LOGROS
// ==========================================

// Obtener todos los coleccionables desbloqueados de un usuario
app.get('/api/collectibles/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const [rows] = await pool.query(
            `SELECT c.*, uc.fecha_desbloqueo 
             FROM usuario_coleccionables uc
             JOIN coleccionables c ON uc.id_coleccionable = c.id_coleccionable
             WHERE uc.id_usuario = ?
             ORDER BY uc.fecha_desbloqueo DESC`,
            [userId]
        );
        res.json({ collectibles: rows });
    } catch (error) {
        console.error('Error al obtener coleccionables del usuario:', error);
        res.status(500).json({ error: error.message });
    }
});

// Desbloquear un coleccionable para un usuario
app.post('/api/collectibles/unlock', async (req, res) => {
    try {
        const { id_usuario, id_coleccionable } = req.body;
        if (!id_usuario || !id_coleccionable) {
            return res.status(400).json({ error: 'Faltan parámetros requeridos.' });
        }

        // INSERT IGNORE para evitar duplicados si ya lo tiene
        const [result] = await pool.query(
            `INSERT IGNORE INTO usuario_coleccionables (id_usuario, id_coleccionable) 
             VALUES (?, ?)`,
            [id_usuario, id_coleccionable]
        );

        const isNew = result.affectedRows > 0;

        // Consultar los detalles del coleccionable para la notificación emergente
        const [items] = await pool.query(
            `SELECT id_coleccionable, nombre, descripcion, tipo, imagen_url 
             FROM coleccionables 
             WHERE id_coleccionable = ?`,
            [id_coleccionable]
        );

        const collectible = items.length > 0 ? items[0] : null;

        res.json({
            success: true,
            isNew,
            message: isNew ? '¡Nuevo coleccionable desbloqueado!' : 'Coleccionable ya obtenido previamente.',
            collectible
        });
    } catch (error) {
        console.error('Error al desbloquear coleccionable:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// REGISTRO DE PARTIDAS (TRIVIA Y MEMORAMA)
// ==========================================

// Mapeo oficial de trivias a su coleccionable correspondiente al sacar 100% (IDs 1 al 11)
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

// Guardar resultado de una trivia y evaluar coleccionables desbloqueados
app.post('/api/trivias/save', async (req, res) => {
    try {
        const { id_usuario, trivia_key, puntaje, total_preguntas, porcentaje } = req.body;
        if (!id_usuario || !trivia_key) {
            return res.status(400).json({ error: 'Faltan datos de la partida.' });
        }

        const normalizedKey = trivia_key.toLowerCase();
        const scorePercent = Number(porcentaje) || ((Number(puntaje) / Number(total_preguntas)) * 100);
        const isPerfect = scorePercent >= 100 || (Number(puntaje) === Number(total_preguntas) && Number(total_preguntas) > 0);

        // 1. Registrar partida en historial
        await pool.query(
            `INSERT INTO historial_trivias (id_usuario, trivia_key, puntaje, total_preguntas, porcentaje)
             VALUES (?, ?, ?, ?, ?)`,
            [id_usuario, normalizedKey, puntaje, total_preguntas, scorePercent]
        );

        // 2. Determinar coleccionables candidatos a desbloquear
        const candidateIds = [];

        // Hito ID 12: Primera Jugada (Responder y completar tu primera trivia con cualquier calificación)
        candidateIds.push(12);

        // Si la trivia fue perfecta (100%):
        if (isPerfect) {
            // Coleccionable específico de equipo (IDs 1 al 11)
            const teamColId = TRIVIA_TEAM_COLLECTIBLES[normalizedKey];
            if (teamColId) {
                candidateIds.push(teamColId);
            }

            // Hito ID 26: Fanático de Corazón (100% en la trivia de tu equipo favorito)
            const [userRows] = await pool.query(
                `SELECT equipo_favorito FROM usuarios WHERE id_usuario = ?`,
                [id_usuario]
            );
            if (userRows.length > 0 && userRows[0].equipo_favorito) {
                const fav = userRows[0].equipo_favorito.toLowerCase();
                if (fav === normalizedKey || (fav === 'caliente' && normalizedKey === 'calientes')) {
                    candidateIds.push(26);
                }
            }
        }

        // Hitos acumulativos:
        // Contar trivias únicas completadas
        const [uniqueRows] = await pool.query(
            `SELECT COUNT(DISTINCT trivia_key) AS total_uniques FROM historial_trivias WHERE id_usuario = ?`,
            [id_usuario]
        );
        const totalUniques = uniqueRows[0]?.total_uniques || 0;
        if (totalUniques >= 11) {
            // ID 13: Bateador Constante (completar las 11 trivias)
            candidateIds.push(13);
        }

        // Contar trivias únicas perfectas (100%)
        const [perfectRows] = await pool.query(
            `SELECT COUNT(DISTINCT trivia_key) AS total_perfects 
             FROM historial_trivias 
             WHERE id_usuario = ? AND (porcentaje >= 100 OR puntaje = total_preguntas)`,
            [id_usuario]
        );
        const totalPerfects = perfectRows[0]?.total_perfects || 0;
        if (totalPerfects >= 5) {
            // ID 14: Medio Camino a la Gloria (al menos 5 trivias al 100%)
            candidateIds.push(14);
        }
        if (totalPerfects >= 11) {
            // ID 15: Grand Slam del Saber (las 11 trivias al 100%)
            candidateIds.push(15);
        }

        // 3. Otorgar los coleccionables candidatos que sean nuevos
        const newCollectibles = [];
        for (const cid of candidateIds) {
            const [insertRes] = await pool.query(
                `INSERT IGNORE INTO usuario_coleccionables (id_usuario, id_coleccionable) VALUES (?, ?)`,
                [id_usuario, cid]
            );

            if (insertRes.affectedRows > 0) {
                const [colInfo] = await pool.query(
                    `SELECT id_coleccionable, nombre, descripcion, tipo, imagen_url FROM coleccionables WHERE id_coleccionable = ?`,
                    [cid]
                );
                if (colInfo.length > 0) {
                    newCollectibles.push(colInfo[0]);
                }
            }
        }

        res.json({
            success: true,
            message: 'Resultado de trivia registrado exitosamente.',
            newCollectibles
        });
    } catch (error) {
        console.error('Error al guardar trivia:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// FASE 3: GUARDAR MEMORAMA Y RECOMPENSAS DE COLECCIONABLES
// ==========================================
app.post('/api/memorama/save', async (req, res) => {
    try {
        const { id_usuario, dificultad, movimientos, tiempo_segundos, completado } = req.body;
        if (!id_usuario) {
            return res.status(400).json({ error: 'Faltan datos de la partida de memorama.' });
        }

        const isCompleted = completado !== false && completado !== 0;
        const diff = (dificultad || 'medio').toLowerCase();
        const moves = parseInt(movimientos, 10) || 0;
        const seconds = parseInt(tiempo_segundos, 10) || 0;

        // 1. Guardar la partida en la base de datos
        await pool.query(
            `INSERT INTO partidas_memorama (id_usuario, dificultad, movimientos, tiempo_segundos, completado)
             VALUES (?, ?, ?, ?, ?)`,
            [id_usuario, diff, moves, seconds, isCompleted ? 1 : 0]
        );

        const candidateIds = [];

        // 2. Evaluar criterios de coleccionables de la Fase 3 solo si la partida fue completada
        if (isCompleted) {
            // A. Victorias por nivel de dificultad
            // ID 16: Lanzador: Zach Morth (Ganar tu primera partida en modo Fácil)
            if (diff === 'facil') candidateIds.push(16);

            // ID 17: Lanzador: Nate Antone (Ganar una partida en modo Medio)
            if (diff === 'medio') candidateIds.push(17);

            // ID 18: Lanzador: Darel Torres (Vencer el reto en modo Difícil)
            if (diff === 'dificil') candidateIds.push(18);

            // B. Récords de velocidad (Tiempo)
            // ID 19: Lanzador: Erasmo Ramírez (Completar modo Fácil en menos de 30 segundos)
            if (diff === 'facil' && seconds < 30) candidateIds.push(19);

            // ID 20: Lanzador: Odrisamer Despaigne (Completar modo Medio en menos de 60 segundos)
            if (diff === 'medio' && seconds < 60) candidateIds.push(20);

            // ID 21: Mánager: Henry Blanco (Resolver modo Difícil en menos de 90 segundos)
            if (diff === 'dificil' && seconds < 90) candidateIds.push(21);

            // C. Récords de precisión (Movimientos)
            // ID 22: Mánager: Roberto Kelly (Completar modo Fácil con menos de 8 movimientos)
            if (diff === 'facil' && moves < 8) candidateIds.push(22);

            // ID 23: Mánager: Benjamín Gil (Resolver modo Medio con menos de 16 movimientos)
            if (diff === 'medio' && moves < 16) candidateIds.push(23);

            // D. Hito Maestro: ID 24: Mánager: Juan Gabriel Castro
            // (Ganar al menos una partida en Fácil, Medio y Difícil)
            const [diffRows] = await pool.query(
                `SELECT DISTINCT dificultad FROM partidas_memorama WHERE id_usuario = ? AND completado = 1`,
                [id_usuario]
            );
            const wonDiffs = new Set(diffRows.map(r => r.dificultad.toLowerCase()));
            if (wonDiffs.has('facil') && wonDiffs.has('medio') && wonDiffs.has('dificil')) {
                candidateIds.push(24);
            }

            // E. Hito de Racha: ID 27: Mánager: Mendy López
            // (Ganar 3 partidas consecutivas de memorama)
            const [recentGames] = await pool.query(
                `SELECT completado FROM partidas_memorama WHERE id_usuario = ? ORDER BY id_partida DESC LIMIT 3`,
                [id_usuario]
            );
            if (recentGames.length >= 3 && recentGames.every(g => g.completado === 1 || g.completado === true)) {
                candidateIds.push(27);
            }
        }

        // 3. Otorgar los coleccionables candidatos que sean nuevos para el usuario
        const newCollectibles = [];
        for (const cid of candidateIds) {
            const [insertRes] = await pool.query(
                `INSERT IGNORE INTO usuario_coleccionables (id_usuario, id_coleccionable) VALUES (?, ?)`,
                [id_usuario, cid]
            );

            if (insertRes.affectedRows > 0) {
                const [colInfo] = await pool.query(
                    `SELECT id_coleccionable, nombre, descripcion, tipo, imagen_url FROM coleccionables WHERE id_coleccionable = ?`,
                    [cid]
                );
                if (colInfo.length > 0) {
                    newCollectibles.push(colInfo[0]);
                }
            }
        }

        res.json({
            success: true,
            message: 'Partida de memorama registrada exitosamente.',
            newCollectibles
        });
    } catch (error) {
        console.error('Error al guardar memorama:', error);
        res.status(500).json({ error: error.message });
    }
});

// Iniciar servidor
app.listen(PORT, async () => {
    console.log(`\n==================================================`);
    console.log(`⚾ Servidor NorthBase corriendo en: http://localhost:${PORT}`);
    console.log(`==================================================`);
    await testConnection();
});
