import fs from 'fs';
import path from 'path';

// Definir el archivo de usuarios
const usersFilePath = path.join(path.resolve(), 'src/utils/data/Usuarios.json');

// Leer usuarios desde el archivo
export const readUsers = () => {
    if (!fs.existsSync(usersFilePath)) {
        return []; // Retorna un arreglo vacío si el archivo no existe
    }
    
    try {
        const data = fs.readFileSync(usersFilePath, 'utf-8');
        return JSON.parse(data); // Parsea el contenido del archivo a un objeto JavaScript
    } catch (error) {
        console.error('Error al leer el archivo de usuarios:', error);
        return []; // Retorna un arreglo vacío en caso de error
    }
};

// Escribir usuarios en el archivo
export const writeUsers = (users) => {
    try {
        fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2)); // Escribe el objeto en formato JSON
    } catch (error) {
        console.error('Error al escribir el archivo de usuarios:', error);
    }
};
