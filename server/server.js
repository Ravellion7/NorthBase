const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { testConnection } = require('./config/db');

// Rutas
const authRoutes = require('./routes/authRoutes');
const collectibleRoutes = require('./routes/collectibleRoutes');
const triviaRoutes = require('./routes/triviaRoutes');
const memoramaRoutes = require('./routes/memoramaRoutes');
const externalRoutes = require('./routes/externalRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Seguridad: Bloquear acceso público directo a archivos del backend, dumps SQL y archivos de configuración
app.use((req, res, next) => {
    const p = req.path.toLowerCase();
    if (
        p.startsWith('/server') ||
        p.startsWith('/node_modules') ||
        p.startsWith('/.git') ||
        p.endsWith('.sql') ||
        p.endsWith('.env') ||
        (p.endsWith('.json') && (p.includes('package') || p.includes('tsconfig')))
    ) {
        return res.status(403).json({ error: 'Acceso denegado a archivos internos.' });
    }
    next();
});

app.use(express.static(path.join(__dirname, '..')));

// Ruta de Salud
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Servidor NorthBase API activo y funcionando.',
        timestamp: new Date().toISOString()
    });
});

// Montaje de Rutas de la API 
app.use('/api/auth', authRoutes);
app.use('/api/collectibles', collectibleRoutes);
app.use('/api/trivias', triviaRoutes);
app.use('/api/memorama', memoramaRoutes);
app.use('/api/external', externalRoutes);

// Iniciar Servidor
app.listen(PORT, async () => {
    console.log(`\n==================================================`);
    console.log(`Servidor NorthBase corriendo en: http://localhost:${PORT}`);
    console.log(`==================================================`);
    await testConnection();
});
