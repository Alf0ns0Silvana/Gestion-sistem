const express = require('express');
const engine = require('ejs-mate'); 
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash'); 
const clientsRoutes = require('../src/routes/clientsRoutes.js');
const { isAuthenticated, checkRole } = require('./isAuth');
const clientSchema =  require('../src/models/clients.js');

// Inicializaciones
const app = express();
require('./database.js');
require('./passport/local-auth.js');

// setting server
app.set('views', path.join(__dirname, 'views')) 
app.engine('ejs', engine); 
app.set('view engine', engine);
app.set ('port', process.env.PORT || 3000);

// middlewares
app.use(morgan('dev')); 
app.use(express.urlencoded({extended : false })); 
app.use(express.json());
app.use(session({
    secret: 'mysecretsession',
    resave: false,
    saveUninitialized: false
}));
app.use(flash()); 
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => { 
    app.locals.registerMessage = req.flash('registerMessage');
    app.locals.loginMessage = req.flash('loginMessage'); 
    app.locals.user =  req.user;
    next();
});
app.use(express.static(path.join(__dirname, 'styles')));

// Middleware para cargar los clientes antes de renderizar perfilAdmin.ejs
app.get('/perfilAdmin', async (req, res, next) => {
    try {
        const clients = await clientSchema.find();
        res.render('perfilAdmin.ejs', { clients });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error obteniendo los clientes');
    }
});

// Rutas de operaciones relacionadas con los clientes
app.use('/perfilAdmin', isAuthenticated, checkRole('admin'), clientsRoutes);

// Ruta para otras páginas
app.use('/', require('./routes/index.js')); 

// starting server
app.listen(app.get('port'), () => {
    console.log('Server starting on port: ', app.get('port'));
});