const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'northbase_secret_key_default';

const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;
function isValidName(val) {
    if (!val || typeof val !== 'string') return true;
    const trimmed = val.trim();
    if (!trimmed) return true;
    return NAME_REGEX.test(trimmed);
}

// REGISTRO DE USUARIO
async function register(req, res) {
    try {
        const {
            name,
            father_last_name,
            mother_last_name,
            email,
            password,
            favorite_team,
            foto_perfil
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Faltan campos obligatorios (nombre, correo o contraseña).'
            });
        }

        if (!isValidName(name)) {
            return res.status(400).json({
                error: 'El nombre solo puede contener letras y espacios (no se permiten números).'
            });
        }

        if (!isValidName(father_last_name) || !isValidName(mother_last_name)) {
            return res.status(400).json({
                error: 'Los apellidos solo pueden contener letras y espacios (no se permiten números).'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const alreadyExists = await userModel.isEmailTaken(cleanEmail);
        if (alreadyExists) {
            return res.status(409).json({
                error: 'El correo electrónico ya se encuentra registrado.'
            });
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUserId = await userModel.createUser({
            name,
            father_last_name,
            mother_last_name,
            email: cleanEmail,
            passwordHash,
            favorite_team,
            foto_perfil
        });

        if (favorite_team) {
            await userModel.linkWelcomeCollectible(newUserId);
        }
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
                equipo_favorito: favorite_team || null,
                foto_perfil: foto_perfil || null
            }
        });
    } catch (error) {
        console.error('Error en authController.register:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            if (error.message.includes('email')) {
                return res.status(409).json({
                    error: 'El correo electrónico ya se encuentra registrado.'
                });
            }
            if (error.message.includes('nombre_usuario')) {
                return res.status(409).json({
                    error: 'El nombre ya está registrado. Por favor intenta con tu segundo nombre o apellido materno.'
                });
            }
            return res.status(409).json({
                error: 'Ya existe una cuenta con estos datos.'
            });
        }
        res.status(500).json({
            error: 'Ocurrió un error en el servidor al intentar registrar el usuario.',
            details: error.message
        });
    }
}

// INICIO DE SESIÓN
async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Por favor ingresa tu correo y contraseña.'
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        const user = await userModel.findByEmail(cleanEmail);
        if (!user) {
            return res.status(401).json({
                error: 'Correo electrónico o contraseña incorrectos.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({
                error: 'Correo electrónico o contraseña incorrectos.'
            });
        }

        const displayName = user.nombre || user.nombre_usuario || user.email.split('@')[0];

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
                equipo_favorito: user.equipo_favorito || null,
                foto_perfil: user.foto_perfil || null
            }
        });
    } catch (error) {
        console.error('Error en authController.login:', error);
        res.status(500).json({
            error: 'Ocurrió un error en el servidor al intentar iniciar sesión.',
            details: error.message
        });
    }
}

// OBTENER DETALLE DEL USUARIO
async function getUser(req, res) {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        delete user.password_hash;
        res.json({ user });
    } catch (error) {
        console.error('Error en authController.getUser:', error);
        res.status(500).json({ error: error.message });
    }
}

// ACTUALIZAR PERFIL
async function updateProfile(req, res) {
    try {
        const {
            id_usuario,
            name,
            father_last_name,
            mother_last_name,
            email,
            password,
            favorite_team,
            foto_perfil
        } = req.body;

        if (!id_usuario) {
            return res.status(400).json({ error: 'Falta el identificador del usuario.' });
        }

        if (!isValidName(name)) {
            return res.status(400).json({
                error: 'El nombre solo puede contener letras y espacios (no se permiten números).'
            });
        }

        if (!isValidName(father_last_name) || !isValidName(mother_last_name)) {
            return res.status(400).json({
                error: 'Los apellidos solo pueden contener letras y espacios (no se permiten números).'
            });
        }

        const currentUser = await userModel.findById(id_usuario);
        if (!currentUser) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        const cleanEmail = email ? email.trim().toLowerCase() : currentUser.email;

        if (cleanEmail !== currentUser.email) {
            const emailInUse = await userModel.isEmailTaken(cleanEmail, id_usuario);
            if (emailInUse) {
                return res.status(409).json({ error: 'El nuevo correo ya está en uso por otra cuenta.' });
            }
        }

        let passwordHash = null;
        if (password && password.trim().length > 0) {
            passwordHash = await bcrypt.hash(password.trim(), 10);
        }

        const updatedUser = await userModel.updateUser(id_usuario, {
            name,
            father_last_name,
            mother_last_name,
            email: cleanEmail,
            passwordHash,
            favorite_team,
            foto_perfil
        });

        if (favorite_team) {
            await userModel.linkWelcomeCollectible(id_usuario);
        }

        delete updatedUser.password_hash;
        const displayName = updatedUser.nombre || updatedUser.nombre_usuario || updatedUser.email.split('@')[0];

        res.json({
            message: 'Perfil actualizado exitosamente.',
            user: {
                id_usuario: updatedUser.id_usuario,
                nombre: displayName,
                email: updatedUser.email,
                equipo_favorito: updatedUser.equipo_favorito || null,
                foto_perfil: updatedUser.foto_perfil || null,
                apellido_paterno: updatedUser.apellido_paterno || null,
                apellido_materno: updatedUser.apellido_materno || null
            }
        });
    } catch (error) {
        console.error('Error en authController.updateProfile:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    register,
    login,
    getUser,
    updateProfile
};
