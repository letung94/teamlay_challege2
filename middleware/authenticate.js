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
// Require user authenticated
var requireAuthenticated = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('error','You must be login to continue.');
        return res.redirect('/login');
    } else {
        return next();
    }
}
// Require admin authenticated
var requireAdminAuthenticated = function(req,res,next){
    if (!req.isAuthenticated()) {
        req.flash('error','You must be login to continue.');
        return res.redirect('/admin/login');
    } else {
        return next();
    }
}

module.exports = {
    requireAuthenticated: requireAuthenticated,
    requireAdminAuthenticated: requireAdminAuthenticated,
    isAvailable: isAvailable
};