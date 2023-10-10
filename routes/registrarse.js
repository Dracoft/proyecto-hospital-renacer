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
            res.render('registrarse', { title: 'registrarse', registrarse: results, opcion: 'disabled', estado: true })
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

    // Consulta para verificar si el usuario ya existe
    connection.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario_a], async (error, results) => {
        if (error) {
            console.log("Error en la consulta", error);
            res.status(500).send("Error en la consulta");
        } else {
            // Si ya existe un usuario con el mismo nombre de usuario, redirige al usuario a otra página
            if (results.length > 0) {
                res.redirect('/registrarse-false');
            } else {
                try {
                    let passwordHash = await bcrypt.hash(pass_a, 8);
                    // Inserta el nuevo usuario si no existe
                    connection.query('INSERT INTO usuarios (usuario, nombre, rol, pass) VALUES (?, ?, ?, ?);', [usuario_a, nombre_a, rol_a, passwordHash], (error, results) => {
                        if (error) {
                            console.log("Error en la consulta", error);
                            res.status(500).send("Error en la consulta");
                        } else {
                            res.redirect('/registrarse-true');
                        }
                    });
                } catch (error) {
                    console.log("Error al hashear la contraseña", error);
                    res.status(500).send("Error al hashear la contraseña");
                }
            }
        }
    });
});

module.exports = router;
