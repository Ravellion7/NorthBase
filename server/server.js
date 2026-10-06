const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { pool, testConnection } = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'northbase_secret_key_default';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

        // INSERT IGNORE o ON DUPLICATE para evitar errores si ya lo tiene
        await pool.query(
            `INSERT IGNORE INTO usuario_coleccionables (id_usuario, id_coleccionable) 
             VALUES (?, ?)`,
            [id_usuario, id_coleccionable]
        );

        res.json({ message: 'Coleccionable desbloqueado exitosamente.' });
    } catch (error) {
        console.error('Error al desbloquear coleccionable:', error);
        res.status(500).json({ error: error.message });
    }
});

// ==========================================
// REGISTRO DE PARTIDAS (TRIVIA Y MEMORAMA)
// ==========================================

// Guardar resultado de una trivia
app.post('/api/trivias/save', async (req, res) => {
    try {
        const { id_usuario, trivia_key, puntaje, total_preguntas, porcentaje } = req.body;
        if (!id_usuario || !trivia_key) {
            return res.status(400).json({ error: 'Faltan datos de la partida.' });
        }

        await pool.query(
            `INSERT INTO historial_trivias (id_usuario, trivia_key, puntaje, total_preguntas, porcentaje)
             VALUES (?, ?, ?, ?, ?)`,
            [id_usuario, trivia_key, puntaje, total_preguntas, porcentaje]
        );

        res.json({ message: 'Resultado de trivia registrado.' });
    } catch (error) {
        console.error('Error al guardar trivia:', error);
        res.status(500).json({ error: error.message });
    }
});

// Guardar resultado del memorama
app.post('/api/memorama/save', async (req, res) => {
    try {
        const { id_usuario, dificultad, movimientos, tiempo_segundos, completado } = req.body;
        if (!id_usuario) {
            return res.status(400).json({ error: 'Faltan datos de la partida de memorama.' });
        }

        await pool.query(
            `INSERT INTO partidas_memorama (id_usuario, dificultad, movimientos, tiempo_segundos, completado)
             VALUES (?, ?, ?, ?, ?)`,
            [id_usuario, dificultad || 'medio', movimientos, tiempo_segundos, completado ?? true]
        );

        res.json({ message: 'Partida de memorama registrada.' });
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
