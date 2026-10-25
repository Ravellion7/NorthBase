const collectibleModel = require('../models/collectibleModel');

// OBTENER COLECCIONABLES DEL USUARIO
async function getUserCollectibles(req, res) {
    try {
        const { userId } = req.params;
        const collectibles = await collectibleModel.getUserCollectibles(userId);
        res.json({ collectibles });
    } catch (error) {
        console.error('Error en collectibleController.getUserCollectibles:', error);
        res.status(500).json({ error: error.message });
    }
}

// DESBLOQUEAR COLECCIONABLE MANUALMENTE
async function unlock(req, res) {
    try {
        const { id_usuario, id_coleccionable } = req.body;
        if (!id_usuario || !id_coleccionable) {
            return res.status(400).json({ error: 'Faltan parámetros requeridos.' });
        }

        const isNew = await collectibleModel.unlockCollectible(id_usuario, id_coleccionable);
        const collectible = await collectibleModel.getCollectibleById(id_coleccionable);

        res.json({
            success: true,
            isNew,
            message: isNew ? '¡Nuevo coleccionable desbloqueado!' : 'Coleccionable ya obtenido previamente.',
            collectible
        });
    } catch (error) {
        console.error('Error en collectibleController.unlock:', error);
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    getUserCollectibles,
    unlock
};
