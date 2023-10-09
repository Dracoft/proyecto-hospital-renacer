var createError = require('http-errors');
var express = require('express');
const session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const moment = require('moment');
const crypto = require('crypto');
const exphbs = require("express-handlebars");//importacion de handelbars

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var registrarseRouter = require('./routes/registrarse');
var bienvenidaRouter = require('./routes/bienvenida');
var pacientesRouter = require('./routes/pacientes');
var doctoresRouter = require('./routes/doctores');
var citasRouter = require('./routes/citas');

var app = express();
app.listen(3000)
console.log(`El servidor esta corriendo en: http://localhost:3000`)

const secret = crypto.randomBytes(32).toString('hex');

app.use(session({
  secret: secret,
  resave: false,
  saveUninitialized: true
}));
console.log('Cadena de secreto generada:', secret);
//configuraciones para utilizar componentes
const hbs = exphbs.create({
  extname: '.hbs',
  partialsDir: ["views/components"]
})

//helper
hbs.handlebars.registerHelper('formatoFecha', function(date){
  return moment(date).format('DD/MM/YYYY')
})
hbs.handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
    case '==':
      return (v1 == v2) ? options.fn(this) : options.inverse(this);
    case '===':
      return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '!=':
      return (v1 != v2) ? options.fn(this) : options.inverse(this);
    case '!==':
      return (v1 !== v2) ? options.fn(this) : options.inverse(this);
    case '<':
      return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
      return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
      return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
      return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    default:
      return options.inverse(this);
  }
});

// view engine setup
app.engine(".hbs", hbs.engine);//define motor de plantilla
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/registrarse', registrarseRouter);
app.use('/bienvenida', bienvenidaRouter);
app.use('/pacientes', pacientesRouter);
app.use('/doctores', doctoresRouter);
app.use('/citas', citasRouter);

app.get('/', (req, res)=> {
	if (req.session.loggedin) {
		res.render('/login/iniciar-administrador',{
			login: true,
			name: req.session.name			
		});		
	} else {
		res.render('/login/iniciar-administrador',{
			login:false,
			name:'Debe iniciar sesión',			
		});				
	}
	res.end();
});

app.use(function(req, res, next) {
  if (!req.user)
      res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  next();
});

app.get('/logout', function (req, res) {
req.session.destroy(() => {
  res.redirect('/')
})
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
