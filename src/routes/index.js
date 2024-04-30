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

function isAuthenticated(req, res, next){ // 
    if (req.isAuthenticated()) {
        return next(); 
    }
    res.redirect('/'); 
};

module.exports = router; 
