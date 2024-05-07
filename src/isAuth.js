function isAuthenticated(req, res, next){ // 
    if (req.isAuthenticated()) {
        return next(); 
    }
    res.redirect('/'); 
};

function checkRole(role) {
    return (req, res, next) => {
      if (req.user.role === role) {
        next();
      } else {
        res.redirect('/signin');
      }
    };
}

module.exports = {
    isAuthenticated,
    checkRole
};