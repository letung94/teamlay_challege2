var di = require('../config/config');
var user_model = di.resolve('user');

var isAvailable = function  (req, res, next) {
    if (req.user.IsConfirmed !== 1){
        res.redirect('/email-verification');
    } else if (req.user.IsBlocked !== 0) {
        res.redirect('/account-locked');
    }else{
        return next();
    }
}


var requireAuthenticated = function (req,res,next) {
    if(!req.isAuthenticated || !req.isAuthenticated()){
        res.redirect('/login');       
    } else{
    return next();
    }
    
}


module.exports = {
    requireAuthenticated: requireAuthenticated,
    isAvailable: isAvailable
};