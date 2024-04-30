const passport = require("passport");
const localStrategy = require('passport-local').Strategy; // strategy para diferentes formas de autenticación

const User = require('../models/user.js'); // es el esquema declarado en user.js
const user = require("../models/user.js");

passport.serializeUser((user, done) => { // de los datos del user solo quiero el id, para que el navegador lo reconozca si existe en la bd
    done(null, user.id);
});
passport.deserializeUser( async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});
// Autenticación para registro - signup
passport.use('local-signup', new localStrategy({ // 1° parámetro > nombre método de auth, 2° prmtr > la nueva strategia 
    //que recibe 2 prmtrs: un obj de config: qué tipos de datos recibe:
    usernameField: 'email', // el user se autentica mendiante nombre/valor que tiene campo en el form
    passwordField: 'password',
    passReqToCallback: true // recibe mas datos (nombre, apellido, etc) y en funcion los almacena al mismo tiempo que mail y pass
}, 
 // y la funcion : qué haremos con esos datos: validar, almacenar, feedback ok/no ok, etc.
async (req, email, password, done) => { // done: callback, develve una response al cliente luego de la autenticación
    // validacion p/q cuando se guarde el new user q esta declarado debajo, una vez que se registra
    const user = await User.findOne({email : email}) // busca por su email, donde el email coincida con el que recibo en linea 22 y lo guarda en const "user"
    if (user) { // si recibo un user, entonces existe..
        return done(null, false, req.flash('registerMessage', 'Email already exists')); // si existe, retorna: null no ocurrio error, false no te devuelvo un user, flash devuelvo msj
    } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        await newUser.save();
        done(null, newUser); // done no puede llevar mas parametros delante solo req, dos datos mas, sino no actua como funcion 
    }
})); // una vez autenticado, termina el proceso, con sus datos, voy a linea 7

// Autenticación para logueo - signin
passport.use('local-signin', new localStrategy ({
    usernameField: 'email', 
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await User.findOne({email : email});
    if (!user) { // si no existe el email devuelve un mensaje 
        return done(null, false, req.flash('loginMessage', 'User not found'));
    } 
    if (!user.comparePassword(password)) { // de lo contrario si existe, compara si la contraseña coincide
        return done(null, false, req.flash('loginMessage', 'Incorrect password'))
    }
    done(null, user) // si su contraseña coincide le devolvemos al user
}));