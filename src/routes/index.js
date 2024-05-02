const express = require('express');
const router = express.Router(); 
const passport = require('passport');

router.get('/', (req, res, next) => { 
    res.render('index.ejs');
});

// register
router.get('/signup', (req, res, next) => {
    res.render('signup.ejs');
});
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup', 
    passReqToCallback: true 
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

router.get('/profile', isAuthenticated, (req, res, next) => { 
    if (req.user.role === 'admin') {
        res.redirect('/perfilAdmin');
      } else if (req.user.role === 'cliente') {
        res.redirect('/perfilClient');
      } else {
        res.redirect('/');
      }
});

function checkRole(role) {
    return (req, res, next) => {
      if (req.user.role === role) {
        next();
      } else {
        res.redirect('/signin');
      }
    };
}
router.get('/perfilAdmin', isAuthenticated, checkRole('admin'), (req, res, next) => {
    res.render('perfilAdmin.ejs');
});
router.get('/perfilClient', isAuthenticated, checkRole('cliente'), (req, res, next) => {
    res.render('perfilClient.ejs');
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

function isAuthenticated(req, res, next){ // 
    if (req.isAuthenticated()) {
        return next(); 
    }
    res.redirect('/'); 
};

module.exports = router; 
