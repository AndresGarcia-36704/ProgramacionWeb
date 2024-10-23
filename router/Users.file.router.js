import express from "express";
import { readUsers, writeUsers } from "../src/utils/fileHandler.js";
import Joi from "joi";
import { sendEmail } from "../src/utils/emailService.js";

export const usersFileRouter = express.Router();

// Validación de datos de usuario
const usersSchema = Joi.object({
  code: Joi.string().required(),
  name: Joi.string().required(),
  age: Joi.number().required(),
  email: Joi.string().email().required(),
});

// Esquema de validación para actualización (permite al menos un campo)
const updateSchema = Joi.object({
  code: Joi.string(),
  name: Joi.string(),
  age: Joi.number(),
  email: Joi.string().email(),
}).min(1); // Requiere al menos un campo para actualizar

// Obtener todos los usuarios
usersFileRouter.get("/", (req, res) => {
  const users = readUsers();
  if (!users)
    return res.status(500).json({ error: "No se pudieron leer los usuarios" });
  res.json(users);
});

// Crear un nuevo usuario
usersFileRouter.post("/", (req, res) => {
  const { error } = usersSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map((e) => e.message) }); // Muestra los detalles de los errores;
  }

  const users = readUsers();
  if (!users)
    return res.status(500).json({ error: "No se pudieron leer los usuarios" });

  const user = {
    ...req.body,
    id: users.length ? users[users.length - 1].id + 1 : 1,
  };

  users.push(user);
  writeUsers(users);

  // Enviar correo de bienvenida (manejar errores de manera asíncrona)
  sendEmail(
    user.email,
    "Bienvenido a nuestra API",
    `Se ha creado el usuario ${user.name}`
  ).catch((err) => console.error("Error enviado correo", err));

  res.status(201).json(user);
});

// Obtener un usuario por ID
usersFileRouter.get("/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: "ID debe ser un número" });
  }

  const users = readUsers();
  const user = users.find((u) => u.id === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: "Usuario no encontrado" });
  }
});

// Actualizar un usuario por ID
usersFileRouter.put("/:id", (req, res) => {
  const { error } = updateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map((e) => e.message) });
  }

  const users = readUsers();
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({ error: "Usuario no encontrado" });
  }

  const updatedUser = { ...users[index], ...req.body };
  users[index] = updatedUser;
  writeUsers(users);

  res.json(updatedUser);
});

// Eliminar un usuario por ID
usersFileRouter.delete("/:id", (req, res) => {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === parseInt(req.params.id));

  if (index !== -1) {
    users.splice(index, 1);
    writeUsers(users);
    res.status(204).end();
  } else {
    res.status(404).json({ error: "Usuario no encontrado" });
  }
});

