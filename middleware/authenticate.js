var di = require('../config/config');
var user_model = di.resolve('user');
var flash = require('express-flash');

var isAvailable = function (req, res, next) {
    if (req.user.IsConfirmed !== 1) {
        req.flash('error', 'Please confirm your email!');
        return res.redirect('/login');
    }
    next();
}


var requireAuthenticated = function (req, res, next) {
    if (!req.isAuthenticated()) {
        console.log('dwadwa');
        req.flash('error','You must be login to continue.');
        res.redirect('/login');
    } else {
        console.log('1111dwadwa');
        return next();
    }
}

var requireNotAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        res.redirect('/cv');
    } else {
        return next();
    }
}

module.exports = {
    requireAuthenticated: requireAuthenticated,
    isAvailable: isAvailable,
    requireNotAuthenticated: requireNotAuthenticated
};