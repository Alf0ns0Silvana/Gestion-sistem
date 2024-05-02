const passport = require("passport");
const localStrategy = require('passport-local').Strategy; 

const User = require('../models/user.js');
const user = require("../models/user.js");

passport.serializeUser((user, done) => { 
    done(null, user.id);
});
passport.deserializeUser( async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

// Autenticación para registro - signup

passport.use('local-signup', new localStrategy({ 
    usernameField: 'email', 
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => { 
    const { role } = req.body;
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (role === 'admin' && existingAdmin) {
        return done(null, false, req.flash('registerMessage', 'Ya hay un administrador registrado'));
    }
    const user = await User.findOne({ email });
    if (user) { 
        return done(null, false, req.flash('registerMessage', 'Email already exists')); 
    } else {
        const newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.role = role;
        await newUser.save();
        done(null, newUser);
    }
}));

// Autenticación user- signin

passport.use('local-signin', new localStrategy ({
    usernameField: 'email', 
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await User.findOne({ email });
    if (!user) { 
        return done(null, false, req.flash('loginMessage', 'User not found'));
    } 
    if (!user.comparePassword(password)) { 
        return done(null, false, req.flash('loginMessage', 'Incorrect password'));
    }
    done(null, user);
}));