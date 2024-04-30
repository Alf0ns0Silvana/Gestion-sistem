const express = require('express');
const router = express.Router(); // metodo que define las rutas del servidor 
const passport = require('passport');

router.get('/', (req, res, next) => { // slash es la 1° que visita el user (ruta inicial)
    res.render('index.ejs');
});

// register
router.get('/signup', (req, res, next) => {
    res.render('signup.ejs');
});
router.post('/signup', passport.authenticate('local-signup', { // desde passport voy a autenticarlo con mi método creado llamado local-sup
    successRedirect: '/profile', // una vez guardado y recibido, redirecciono a su perfil
    failureRedirect: '/signup', // y si se equivoca redirecciona a signup
    passReqToCallback: true // internamente le pasamos la propiedad req p/pasarle todos los datos que recibe desde el cliente
}));

// login
router.get('/signin', (req, res, next) => {
    res.render('signin.ejs');
});
router.post('/signin', passport.authenticate('local-signin', { 
    successRedirect: '/profile', 
    failureRedirect: '/signin', 
    passReqToCallback: true 
}));

// Ejemplo luego del registro 
router.get('/profile', isAuthenticated, (req, res, next) => { // c/v que user ingrese se ejecuta isAuthe.
    res.render('profile.ejs');
});

// logout
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

// Esta funcion va a ejecutarla cualquier ruta que este autenticada antes (/profile - linea 30)
function isAuthenticated(req, res, next){ // 
    if (req.isAuthenticated()) { // si el user esta autenticado nos devuelve true
        return next(); // si es true, continúa a la sig ruta
    }
    res.redirect('/'); // si no es true, redirecciona a ruta inicial o signin
};
// En vez de llamarla en cada una de las rutas, en caso de tener muchas se puede: 
//router.use((req, res, next) => {
//     isAuthenticated(req, res, next);
//     next();
// }); y a partir de aqui hacia abajo colocar las rutas q quiero proteger con la autenticacion

module.exports = router; // una vez definidas se exporta
