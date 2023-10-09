const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { connection } = require('../database/conexion.js');



router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM usuarios', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('registrarse', { title: 'registrarse', registrarse: results, opcion: 'disabled', estado: true  })
        }
    });
});

router.get('/agregar-administrador', function (req, res, next) {
    res.sendFile('registro-administrador.html', { root: 'public' })
});

router.post('/agregar', async (req, res) => {
    const usuario_a = req.body.usuario_administrador;
    const nombre_a = req.body.nombres_administrador;
    const rol_a = req.body.rol_administrador;
    const pass_a = req.body.pass_administrador;
    try {
        let passwordHash = await bcrypt.hash(pass_a, 8);
        connection.query('INSERT INTO usuarios (usuario, nombre, rol, pass) VALUES (?, ?, ?, ?);', [usuario_a, nombre_a, rol_a, passwordHash], (error, results) => {
            if (error) {
                console.log("Error en la consulta", error);
                res.status(500).send("Error en la consulta");
            } else {
                res.redirect('/login');
            }
        });
    } catch (error) {
        console.log("Error al hashear la contraseña", error);
        res.status(500).send("Error al hashear la contraseña");
    }   
});
module.exports = router;
