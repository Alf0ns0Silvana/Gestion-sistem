const express = require('express');
const engine = require('ejs-mate'); 
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash'); // utilziado en local-auth con passport, recibe nombre variable y luego msj que queremos dar

// Inicializaciones
const app = express();
require('./database.js');
require('./passport/local-auth.js');

// setting server
app.set('views', path.join(__dirname, 'views')) // dirname devuelve la direccion del archivo que se ejecuta (index.js) que
//se concatena con la carpeta "views"
app.engine('ejs', engine); // crea new motor de plantillas (engine) que será el motor instalado (ejs llamado engine)
app.set('view engine', engine);
app.set ('port', process.env.PORT || 3000);

// middlewares (morgan) se ejecutan antes de las rutas 
app.use(morgan('dev')); // ayuda para ver si en terminal si, desde el cliente, recibimos las peticiones http ok o no
app.use(express.urlencoded({extended : false })); // permite recibir los datos del cliente
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
}));
app.use(flash()); // Va post sesiones, ya que hace uso de ellas para emitir un msj, igual que passport, que lo usará para la validación
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => { // app.locals manera de declarar variables accesibles desde toda la aplicacion .mismo name que en flash
    app.locals.registerMessage = req.flash('registerMessage'); // requiero valor que le di en local-auth p/q aparezca el msj en la view, si el msj existe lo guarda en .registerMessage
    app.locals.loginMessage = req.flash('loginMessage'); 
    next();
});

// Routes 
app.use('/', require('./routes/index.js')); // express utiliza esa ruta c/vez que user ingresa a /

// starting server
app.listen(app.get('port'), () => {
    console.log('Server starting on port: ', app.get('port'));
});