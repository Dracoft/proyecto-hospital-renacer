const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { connection } = require('../database/conexion.js');

router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM usuarios', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error);
            res.status(500).send("Error en la consulta");
        } else {
            res.render('login', { title: 'login', login: results, opcion: 'disabled', estado: true });
        }
    });
});

router.get('/iniciar-administrador', function (req, res, next) {
    res.sendFile('login.html', { root: 'public' });
});

router.post('/auth', async (req, res) => {
    const user = req.body.usuario_administrador;
    const pass = req.body.pass_administrador;

    try {
        if (user && pass) {
            connection.query('SELECT * FROM usuarios WHERE usuario = ?', [user], async (error, results, fields) => {
                if (error) {
                    console.log("Error en la consulta", error);
                    res.status(500).send("Error en la consulta");
                } else {
                    if (results.length === 0 || !(await bcrypt.compare(pass, results[0].pass))) {
                            return res.render('./login-false');
                    } else {
                        req.session.loggedin = true; 
                        req.session.name = results[0].name;

                        return res.render('./loggin-true' , { name: user });

                    }
                }
                res.end();
            });
        } else {
            return res.send('Por favor, ingrese usuario y contraseña');
        }
    } catch (error) {
        res.status(500).send("Error en la autenticación");
    }
});

module.exports = router;
