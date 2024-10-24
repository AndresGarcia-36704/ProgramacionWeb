import express from "express";
import { readUsers, writeUsers } from "../src/utils/fileHandler.js";
import Joi from "joi";
import { sendEmail } from "../src/utils/emailService.js";
import { userMetaData } from "../src/middleware/UserMetaData.js";
import dayjs from "dayjs";

export const usersFileRouter = express.Router();

// Validación de datos de usuario
const usersSchema = Joi.object({
  code: Joi.string().required(), // ID es requerida para el esquema
  name: Joi.string().required(), // NAME es requerida para el esquema
  age: Joi.number().required(), // AGE es requerida para el esquema
  email: Joi.string().email().required(), // EMAIL es requerida para el esquema
  ip: Joi.string().optional(), // IP no es requerida para el esquema
  created_at: Joi.string().optional(), // Fecha no es requerida para el esquema
});

// Esquema de validación para actualización (permite al menos un campo)
const updateSchema = Joi.object({
  code: Joi.string(),
  name: Joi.string(),
  age: Joi.number(),
  email: Joi.string().email(),
}).min(1); // Requiere al menos un campo para actualizar

// Esquema de validación para actualización (permite al menos un campo)
const updateFieldSchema = Joi.object({
  fieldName: Joi.string().valid("name", "age", "email").required(), // Solo permite 'name', 'age', o 'email'
  newValue: Joi.alternatives()
    .conditional("fieldName", {
      is: "name",
      then: Joi.string().required(),
      otherwise: Joi.any().required(), // Para otros casos (e.g., age, email)
    })
    .required(),
});

// Obtener todos los usuarios
usersFileRouter.get("/", (req, res) => {
  const users = readUsers();
  console.log("Usuarios leídos:", users);
  if (!users) {
    return res.status(500).json({ error: "No se pudieron leer los usuarios" });
  }

  // Obtener parámetros de consulta
  const { filterKey, filterValue, limit } = req.query;

  // Filtrar usuarios si se proporciona un filtro
  let filteredUsers = users;

  if (filterKey && filterValue) {
    // Validar que filterKey es una clave válida
    if (!["code", "name", "age", "email"].includes(filterKey)) {
      return res.status(400).json({ error: "Filtro inválido" });
    }
    filteredUsers = users.filter((user) => user[filterKey] === filterValue);
  }

  //Aplicar limite si se proporciona
  if (limit) {
    const limitedNumber = parseInt(limit, 10);
    if (!isNaN(limitedNumber) && limitedNumber > 0) {
      filteredUsers = filteredUsers.slice(0, limitedNumber);
    } else {
      return res
        .status(400)
        .json({ error: "El límite debe ser un número positivo." });
    }
  }

  res.json(filteredUsers);
});

// Crear un nuevo usuario
usersFileRouter.post("/", userMetaData, async (req, res) => {
  // <- async agregado aquí
  const { error } = usersSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map((e) => e.message) });
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

  // Enviar correo de bienvenida
  try {
    await sendEmail(
      // <- `await` usado correctamente dentro de una función `async`
      user.email,
      "Bienvenido a nuestra API",
      `Se ha creado el usuario ${user.name}`
    );
    console.log("Correo enviado con éxito");
  } catch (err) {
    console.error("Error enviando correo", err);
  }

  res.status(201).json(user); // El usuario se crea y se retorna con status 201
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

  const updatedUser = {
    ...users[index],
    ...req.body,
    updated_at: dayjs().format("HH:mm DD-MM-YYYY"),
  };
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

// Actualizar un campo de todos los registros
usersFileRouter.put("/", (req, res) => {
  console.log("Cuerpo recibido:", req.body); // Log para ver el cuerpo recibido

  const { error } = updateFieldSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details.map((e) => e.message) });
  }

  const { fieldName, newValue } = req.body;

  let users = readUsers();
  if (!users)
    return res.status(500).json({ error: "No se pudieron leer los usuarios" });

  users = users.map((user) => ({
    ...user,
    [fieldName]: newValue,
    updated_at: dayjs().format("HH:mm DD-MM-YYYY"),
  }));

  writeUsers(users);

  res.json({
    message: `El campo ${fieldName} de todos los usuarios ha sido actualizado exitosamente.`,
    users,
  });
});
