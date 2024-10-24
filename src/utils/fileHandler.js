import fs from "fs";
import path from "path";

// Definir el archivo de usuarios
const usersFilePath = path.join(
  path.resolve(),
  "../api_user_web2_2024-2/src/data/usuarios.json"
);

// Leer usuarios desde el archivo
export const readUsers = () => {
  console.log("Intentando leer el archivo de usuarios..."); // Agrega esta línea

  if (!fs.existsSync(usersFilePath)) {
    console.error(
      "El archivo de usuarios no existe en la ruta:",
      usersFilePath
    );
    return []; // Retorna un arreglo vacío si el archivo no existe
  }

  try {
    const data = fs.readFileSync(usersFilePath, "utf-8");
    console.log("Datos leídos del archivo:", data); // Asegúrate de que se imprima
    const users = JSON.parse(data); // Parsea el contenido del archivo a un objeto JavaScript
    console.log("Usuarios leídos:", users); // Imprime los usuarios leídos
    return users;
  } catch (error) {
    console.error("Error al leer el archivo de usuarios:", error);
    return []; // Retorna un arreglo vacío en caso de error
  }
};

// Escribir usuarios en el archivo
export const writeUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2)); // Escribe el objeto en formato JSON
  } catch (error) {
    console.error("Error al escribir el archivo de usuarios:", error);
  }
};
