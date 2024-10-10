import express from 'express';
import { readUsers, writeUsers } from '../utils/fileHandler.js';
import Joi from 'joi';
import { sendEmail } from '../utils/emailService.js';

const router = express.Router();

// Validación de datos de usuario
const usersSchema = Joi.object({
    code: Joi.string().required(),
    name: Joi.string().required(),
    age: Joi.number().required(),
    email: Joi.string().email().required()
});

// Obtener todos los usuarios
router.get('/', (req, res) => {
    const users = readUsers();
    res.json(users);
});

// Crear un nuevo usuario
router.post('/', (req, res) => {
    const { error } = usersSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details.map(e => e.message) }) // Muestra los detalles de los errores;

    const users = readUsers();
    const user = {
        ...req.body,
        id: users.length ? users[users.length - 1].id + 1 : 1
    };
    users.push(user);
    writeUsers(users); 

    // Enviar correo de bienvenida
    sendEmail(user.email, "Bienvenido a nuestra API", `Se ha creado el usuario ${user.name}`);

    res.status(201).json(user);
});

// Obtener un usuario por ID
router.get('/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        return res.status(400).json({ error: 'ID debe ser un número' });
    }

    const users = readUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
        res.json(user);
    } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
    }
});

// Actualizar un usuario por ID
router.put('/:id', (req, res) => {
    const users = readUsers();
    const index = users.findIndex(u => u.id === parseInt(req.params.id));

    if (index === -1) {
        return res.status(400).json({ error: 'Usuario no encontrado' });          
    } 

    const updateSchema = Joi.object({
        code: Joi.string(),
        name: Joi.string(),
        age: Joi.number(),
        email: Joi.string().email()
}).min(1); // Se requieren al menos un campo actualizado

    const { error } = updateSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details.map(e => e.message) });

    const updatedUser = { ...users[index], ...req.body };
    users[index] = updatedUser;
    writeUsers(users);
    res.json(updatedUser);
});

// Eliminar un usuario por ID
router.delete('/:id', (req, res) => {
    const users = readUsers();
    const index = users.findIndex(u => u.id === parseInt(req.params.id));
    if (index !== -1) {
        users.splice(index, 1);
        writeUsers(users);
        res.status(204).end();
    } else {
        res.status(404).json({ error: 'Usuario no encontrado' });
    }
});

export default router;
