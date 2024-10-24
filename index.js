import express from "express";
import { routerUsers } from "./router/Index.js";
import fs from "fs";
import dayjs from "dayjs";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const timestamp = dayjs().format("DD-MM-YYYY HH:mm:ss");
  const method = req.method;
  const path = req.path;
  const headers = JSON.stringify(req.headers);

  // Crear el registro
  const logEntry = `${timestamp} [${method}] [${path}] [${headers}]\n`;

  // Escribir en el archivo access_log.txt
  fs.appendFile("access_log.txt", logEntry, (err) => {
    if (err) {
      console.error("Error al escribir en el archivo de registro:", err);
    }
  });

  next();
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || "Error interno del servidor",
  });
});

routerUsers(app);

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor está corriendo en el puerto 3000");
});
