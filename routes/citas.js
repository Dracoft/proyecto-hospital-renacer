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
    connection.query('SELECT cm.id, cm.fecha, cm.id_paciente, pac.nombre as "nombre_paciente", pac.cedula as "cedula_paciente", doc.nombre as "nombre_doctor", doc.apellido as "apellido_doctor", doc.consultorio , doc.especialidad FROM citas_medicas cm JOIN pacientes pac ON cm.id_paciente = pac.cedula JOIN doctores doc ON cm.id_doctor = doc.cedula', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('citas', { title: 'citas', citas: results, opcion: 'disabled', estado: true})
        }
    });
});

router.get('/enviar/:clave', requireLogin, function (req, res, next) {
    const clave = req.params.clave;
    connection.query('SELECT * FROM citas_medicas', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.render('citas', { title: 'citas', claveSeleccionada: clave, citas: results, opcion: 'disabled', estado: false })
        }
    });
});


router.get('/agregar-cita', requireLogin, function (req, res, next) {
    connection.query('SELECT cedula FROM pacientes', (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            connection.query('SELECT especialidad FROM doctores', (error, results2) => {
                if (error) {
                    console.log("Error en la consulta", error)
                    res.status(500).send("Error en la consulta")
                } else {
                    res.render('registro-citas', { layout: 'registro', pacientes: results, doctores: results2 })
                }
            });
        }
    });
});

router.post('/agregar', requireLogin, function (req, res, next) {
    const cedula_paciente = req.body.cedula;
    const fecha = req.body.fecha;
    const especialidad = req.body.especialidad;
    connection.query(`SELECT cedula FROM doctores WHERE especialidad='${especialidad}'`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            let cedulaDoctor = results[0].cedula
            connection.query(`INSERT INTO citas_medicas (id_paciente, id_doctor, fecha, especialidad) VALUES (${cedula_paciente},${cedulaDoctor}, '${fecha}', '${especialidad}')`,  (error, result) => {
                if (error) {
                    console.log("Ocurrio un error en la ejecución", error)
                    res.status(500).send("Error en la consulta");
                } else {
                    res.redirect('/citas');
                }
            });
        }
    });
})
//eliminar citas
router.get('/eliminar/:id', requireLogin, function (req, res, next) {
    const id = req.params.id
    connection.query(`DELETE FROM citas_medicas WHERE id=${id}`, (error, results) => {
        if (error) {
            console.log("Error en la consulta", error)
            res.status(500).send("Error en la consulta")
        } else {
            res.redirect('/citas')
        }
    });
});


router.post('/actualizar/:id', requireLogin, (req, res) => {
    const id = req.params.id;
    const fechaInput = req.body.fecha;

    // Formatear la fecha al formato 'YYYY-MM-DD'
    const fecha = new Date(fechaInput);
    const formattedFecha = fecha.toISOString().split('T')[0];

    connection.query(`UPDATE citas_medicas SET fecha='${formattedFecha}' WHERE id=${id}`, (error, result) => {
        if (error) {
            console.log("Ocurrió un error en la ejecución", error)
            res.status(500).send("Error en la consulta");
        } else {
            res.redirect('/citas');
        }
    });
});


module.exports = router;

