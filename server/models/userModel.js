const { pool } = require('../config/db');

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

async function findByEmail(email) {
    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE email = ?',
        [email]
    );
    return rows.length > 0 ? rows[0] : null;
}

async function findById(id) {
    const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE id_usuario = ?',
        [id]
    );
    return rows.length > 0 ? rows[0] : null;
}

async function isEmailTaken(email, excludeUserId = null) {
    if (excludeUserId) {
        const [rows] = await pool.query(
            'SELECT id_usuario FROM usuarios WHERE email = ? AND id_usuario != ?',
            [email, excludeUserId]
        );
        return rows.length > 0;
    }
    const [rows] = await pool.query(
        'SELECT id_usuario FROM usuarios WHERE email = ?',
        [email]
    );
    return rows.length > 0;
}

async function createUser({ name, father_last_name, mother_last_name, email, passwordHash, favorite_team, foto_perfil }) {
    const cols = await getUserTableColumns();

    const insertFields = [];
    const insertPlaceholders = [];
    const insertValues = [];

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
        let baseUsername = [name, father_last_name].filter(Boolean).join(' ').trim();
        if (!baseUsername) baseUsername = email.split('@')[0];

        let finalUsername = baseUsername;
        let counter = 1;
        while (true) {
            const [dupUser] = await pool.query(
                'SELECT id_usuario FROM usuarios WHERE nombre_usuario = ?',
                [finalUsername]
            );
            if (dupUser.length === 0) break;
            counter++;
            finalUsername = `${baseUsername} ${counter}`;
        }

        insertFields.push('nombre_usuario');
        insertPlaceholders.push('?');
        insertValues.push(finalUsername);
    }

    insertFields.push('email', 'password_hash');
    insertPlaceholders.push('?', '?');
    insertValues.push(email, passwordHash);

    if (cols.has('equipo_favorito')) {
        insertFields.push('equipo_favorito');
        insertPlaceholders.push('?');
        insertValues.push(favorite_team || null);
    }

    if (cols.has('foto_perfil')) {
        insertFields.push('foto_perfil');
        insertPlaceholders.push('?');
        insertValues.push(foto_perfil || null);
    }

    const sql = `INSERT INTO usuarios (${insertFields.join(', ')}) VALUES (${insertPlaceholders.join(', ')})`;
    const [result] = await pool.query(sql, insertValues);

    return result.insertId;
}

async function updateUser(id_usuario, { name, father_last_name, mother_last_name, email, passwordHash, favorite_team, foto_perfil }) {
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

    if (email) {
        updateFields.push('email = ?');
        updateValues.push(email);
    }

    if (cols.has('equipo_favorito') && favorite_team !== undefined) {
        updateFields.push('equipo_favorito = ?');
        updateValues.push(favorite_team || null);
    }

    if (cols.has('foto_perfil') && foto_perfil !== undefined) {
        updateFields.push('foto_perfil = ?');
        updateValues.push(foto_perfil || null);
    }

    if (passwordHash) {
        updateFields.push('password_hash = ?');
        updateValues.push(passwordHash);
    }

    if (updateFields.length > 0) {
        updateValues.push(id_usuario);
        const sql = `UPDATE usuarios SET ${updateFields.join(', ')} WHERE id_usuario = ?`;
        await pool.query(sql, updateValues);
    }

    return await findById(id_usuario);
}

async function linkWelcomeCollectible(userId) {
    try {
        await pool.query(
            `INSERT IGNORE INTO usuario_coleccionables (id_usuario, id_coleccionable) VALUES (?, 25)`,
            [userId]
        );
    } catch (err) {
        console.warn('Error al vincular coleccionable de equipo favorito:', err.message);
    }
}

module.exports = {
    getUserTableColumns,
    findByEmail,
    findById,
    isEmailTaken,
    createUser,
    updateUser,
    linkWelcomeCollectible
};
