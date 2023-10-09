var express = require('express');
var router = express.Router();

function requireLogin(req, res, next) {
  if (!req.session.loggedin) {
    res.redirect('/login/iniciar-administrador'); // Redirigir al usuario a la página de inicio de sesión
  } else {
    next();
  }
}

/* GET home page. */
router.get('/', requireLogin, function(req, res, next) {
  res.render('index', { title: 'Proyecto Final Hospital' });
});

module.exports = router;
