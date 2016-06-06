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
        console.log(1);
        req.flash('error','You must be login to continue.');
        return res.redirect('/login');
    } else {
        console.log(2);
        return next();
    }
}

var requireNotAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        console.log(3);
        res.redirect('/cv');
    } else {
        console.log(4);
        return next();
    }
}

module.exports = {
    requireAuthenticated: requireAuthenticated,
    isAvailable: isAvailable,
    requireNotAuthenticated: requireNotAuthenticated
};