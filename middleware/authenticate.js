var di = require('../config/config');
var user_model = di.resolve('user');

var isEmailExisted = function (req, res, next) {
    user_model.getByEmail(req.body.email, function (err, data) {
        if (data) {
            res.render('pages/login', { errorMessage: 'Email already exists' });
        }
        next();
    })
}

var isUsernameExisted = function (req, res, next) {
    user_model.getByUsername(req.body.username, function (err, data) {
        if (data) {
            res.render('pages/login', { errorMessage: 'Username already exists' });
        }
        next();
    })
}

var requireAuthenticated = function (req,res,next) {
    if(!req.isAuthenticated()) res.redirect('/login');
}

module.exports = {
    requireAuthenticated: requireAuthenticated,
    isUsernameExisted: isUsernameExisted,
    isEmailExisted: isEmailExisted
};