var express = require('express');
var router = express.Router();
var admin_service = require('../config/config').resolve('admin');
var login_service = require('../config/config').resolve('login_service');

router.get('/admin/main', function (req, res) {
    var service = new admin_service();
    service.getAllUser(function (flag, err, data) {
        if (flag == -1) {
            return res.render('server_error/500');
        }
        var data_json = JSON.stringify(data);
        var temp_json = JSON.parse(data_json);
        res.render('pages/admin', {
            users: temp_json
        });
    })
});
router.get('/admin/login', function (req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/');
    }
    res.render('pages/admin_login', { errorMessage: req.flash('error'), backdata: req.body });
});

router.post('/admin/login', function (req, res, next) {
    login_service.authenticate('local', {
        failureFlash: true
    }, function (err, user, info) {
        if (err) {
            return res.render('pages/admin_login', {
                errorMessage: err.message,
                backdata: req.body
            });
        }

        if (!user) {
            return res.render('pages/admin_login', {
                errorMessage: info.message,
                backdata: req.body
            });
        }
        return req.logIn(user, function (err) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/admin/login');
            } else {
                var service = new admin_service();
                service.getUserRoleByUsername(user.Username, function (flag, err, data) {
                    if (flag == -1)
                        return res.render('server_error/500');
                    if (flag == 0 || data == 'user'){
                        res.render('pages/admin_login', { backdata: req.body, errorMessage: 'This account does not have permission to continue.' });
                        req.logOut();
                        req.session.destroy();
                        return;
                    }
                    return res.redirect('/admin/main');
                });
            }
        });
    })(req, res, next);
});

module.exports = router;