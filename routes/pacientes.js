var express = require('express');
var router = express.Router();
const { connection } = require('../database/conexion.js')

function requireLogin(req, res, next) {
    if (!req.session.loggedin) {
      res.redirect('/login/iniciar-administrador');
    } else {
      next();
    }
}

router.get('/', requireLogin, function (req, res, next) {
    connection.query('SELECT * FROM pacientes', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('pacientes', { title: 'pacientes', pacientes: results, opcion: 'disabled', estado: true })
        }
    });
});

router.get('/enviar/:clave', function (req, res, next) {
    const clave = req.params.clave;
    connection.query('SELECT * FROM pacientes', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('pacientes', { title: 'pacientes', claveSeleccionada: clave, pacientes: results, opcion: 'disabled', estado: false })
        }
    });
});


router.get('/agregar-pacientes', requireLogin, function (req, res, next) {
    res.sendFile('registro-pacientes.html', { root: 'public' })
});


//Agregar Pacientes
router.post('/agregar', requireLogin, (req, res) => {
    const cedula_p = req.body.cedula_paciente
    const nombre_p = req.body.nombre_paciente
    const apellido_p = req.body.apellido_paciente
    const edad_p = req.body.edad_paciente
    const telefono_p = req.body.telefono_paciente
    connection.query(`INSERT INTO pacientes (cedula, nombre, apellido, edad, telefono) VALUES (${cedula_p},'${nombre_p}','${apellido_p}',${edad_p},${telefono_p});`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.redirect('/pacientes')
        }
    });

})
//eliminar Pacientes
router.get('/eliminar/:cedula_paciente', requireLogin, function (req, res, next) {
    const cedula_pa = req.params.cedula_paciente
    connection.query(`DELETE FROM citas_medicas WHERE id_paciente=${cedula_pa}`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            connection.query(`DELETE FROM pacientes WHERE cedula=${cedula_pa}`, (error, results) => {
                if (error) {
                    console.log("Error en la consulta", error)
                    res.status(500).send("Error en la consulta")
                } else {
                    res.redirect('/pacientes')
                }
            });
        }
    });
});

router.post('/actualizar/:cedula_paciente', requireLogin, (req, res) => {
    const cedula_p = req.params.cedula_paciente;
    const nombre_p = req.body.nombre_paciente;
    const apellido_p = req.body.apellido_paciente;
    const edad_p = req.body.edad_paciente;
    const telefono_p = req.body.telefono_paciente;
    connection.query(`UPDATE pacientes SET nombre='${nombre_p}', apellido='${apellido_p}', edad=${edad_p}, telefono=${telefono_p} WHERE cedula=${cedula_p}`, (error, result) => {
        if (error) {
            console.log("Ocurrio un error en la ejecución", error)
            res.status(500).send("Error en la consulta");
        } else {
            res.redirect('/pacientes');
        }
    });
})
module.exports = router;
