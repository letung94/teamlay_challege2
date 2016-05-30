var di = require('../config/config');
var user_model = di.resolve('user');
var bcrypt = require('bcrypt-nodejs');

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

module.exports = {
    isUsernameExisted: isUsernameExisted,
    isEmailExisted: isEmailExisted
};