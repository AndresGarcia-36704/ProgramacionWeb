import express from 'express';
import usuariosRouter from './router/usuarios.js';

const app = express();
app.use(express.json());

// Middleware para registrar solicitudes
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Rutas
app.use('/users', usuariosRouter);

// Manejo de errores 
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Error interno del servidor' });
});

// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor está corriendo en el puerto 3000');
});