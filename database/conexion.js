require('dotenv').config(); // Cargar variables de entorno desde el archivo .env

const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

connection.connect((error) => {
    if (error) {
        console.error('Error al conectar a la base de datos: ', error);
    } else {
        console.log('Conexión a la base de datos exitosa');
    }
});

module.exports = { connection };