var account_service = require('../config/config').resolve('admin');
var flash = require('express-flash');

// Require user authenticated
var requireAuthenticated = function (req, res, next) {
    if (!req.isAuthenticated()) {
        return res.render('pages/login', { errorMessage: 'You must login to continue.' });
    }
    return next();
}
// Require admin authenticated
var requireAdminAuthenticated = function (req, res, next) {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must login to continue.');
        return res.redirect('/admin/login');
    } else {
        var service = new account_service();
        service.getUserRoleByUsername(req.user.Username, function (flag, err, data) {
            if (flag == -1)
                return res.render('server_error/500');
            if (flag == 0 || data == 'user')
                return res.redirect('/');
            return next();
        });
    }
}

module.exports = {
    requireAuthenticated: requireAuthenticated,
    requireAdminAuthenticated: requireAdminAuthenticated
};