var di = require('../config/config');
var user_model = di.resolve('user');

var requireAuthenticated = function (req,res,next) {
    if(!req.isAuthenticated || !req.isAuthenticated()){
        res.redirect('/login');       
    } else{
    return next();
    }
    
}

module.exports = {
    requireAuthenticated: requireAuthenticated
};