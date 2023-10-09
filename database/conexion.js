const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'hospital',
    charset: 'utf8mb4'
});


connection.connect((error) => {
    if (error) {
        console.error('Error al conectar a la base de datos: ', error);
    } else {
        console.log('Conexión a la base de datos exitosa');
    }
});

module.exports = { connection };
