var di = require('../config/config');
var user_model = di.resolve('user');
var flash = require('express-flash');

var isAvailable = function  (req, res, next) {
    if (req.user.IsConfirmed !== 1){
        req.flash('error','Please confirm your email!');
        return res.redirect('/login');
    }
      next();  
}


var requireAuthenticated = function (req,res,next) {
    if(!req.isAuthenticated || !req.isAuthenticated()){
        res.redirect('/login');       
    } else{
    return next();
    }
    
}

var isLogin = function(req, res, next) {
    if(req.isAuthenticated){
        res.redirect('/cv');
    } else {
        return next();
    }
}

module.exports = {
    requireAuthenticated: requireAuthenticated,
    isAvailable: isAvailable,
    isLogin: isLogin
};