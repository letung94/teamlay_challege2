var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var di = require('../config/config');
var passport = require('../config/passport_authenticate');
var user_model = di.resolve('user');
var uuid = require('node-uuid');
var mailer = require('express-mailer');
var app = require('../server');
var flash = require('express-flash');
var async = require('async');
var login_service = require('../config/config').resolve('login_service');
var account_service = require('../config/config').resolve('account_service');

/*
    *LogIn GET
*/
router.get('/login', function (req, res) {
    if (req.isAuthenticated()) {
        res.redirect('/cv');
    } else res.render('pages/login', {
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
    });
});

/*
    *LogIn POST
*/
router.post('/login', function (req, res, next) {
    if (req.body.remember) req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
    login_service.authenticate('local', {
        failureFlash: true
    }, function (err, user, info) {

        if (err) {
            return res.render('pages/login', {
                errorMessage: err.message
            });
        }

        if (!user) {
            return res.render('pages/login', {
                errorMessage: info.message
            });
        }
        return req.logIn(user, function (err) {
            if (err) {
                req.flash('error', err.message);
                return res.redirect('/login');
            } else {
                return res.redirect('/cv');
            }
        });
    })(req, res, next);
});


/*
    *Registration GET
*/
router.get('/register', function (req, res) {
    res.render('pages/register', {
        errorMessage: req.flash('error')
    });
});


/*
    *Registration POST
*/
router.post('/register', function (req, res) {
    var service = new account_service()
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var email = req.body.email;
    var password = bcrypt.hashSync(req.body.password);
    var is_confirmed = 0
    var is_blocked = 0
    var verify_token = uuid.v1();
    var created_date = new Date();
    async.waterfall([
        function (done) {
            service.getByUsername({
                "Username": username
            }, function (flag, data) {
                if (flag == -1) {
                    return res.redirect('/error/500');
                }
                if (data) {
                    req.flash('error', 'Username already exists');
                    return res.redirect('/register');
                }
                done();
            })
        },
        function (done) {
            service.getByEmail({
                "Email": email
            }, function (flag, data) {
                if (flag == -1) {
                    return res.redirect('/error/500');
                }
                if (data) {
                    req.flash('error', 'Email already exists');
                    return res.redirect('/register');
                }
                done();
            })

        },
        function (done) {
            service.addUser({
                "Firstname": firstname,
                "Lastname": lastname,
                "Username": username,
                "Email": email,
                "PasswordHash": password,
                "CreatedDate": created_date,
                "VerifyToken": verify_token,
                "IsConfirmed": is_confirmed,
                "IsBlocked": is_blocked
            }, function (flag, data) {
                if (flag == 0) {
                    return res.redirect('/error/500');
                }
                if (flag == -1) {

                    return res.redirect('/error/500');
                }
            })
            done();
        }, //send mail
        function (done) {
            service.sendMail(email, verify_token, req, res);
            done();
        },
        function (done) {
            req.flash('success', 'We emailed a link to you. Please check your email and click the link to verify your email address.');
            res.redirect('/login');
    }
    ]);
})

/*
    *verify email
*/
router.get("/verify/:token", function (req, res, next) {
    var service = new account_service();
    var token = req.params.token;
    async.waterfall([
        function (done) {
            service.getVerifyToken({
                "VerifyToken": token
            }, function (flag, data) {
                if (flag == -1) {
                    return res.redirect('/error/500');
                }
                if (!data) {
                    res.render('pages/notification', {
                        noti_message: 'Token is invalid or has expired'
                    });
                    return;
                }
                var user = data;
                user.VerifyToken = ' ';
                user.IsConfirmed = 1;
                done(null, user);
            })
        },
        function (user, done) {
            service.updateUser(user, function (flag, done) {
                if (flag == -1) {
                    return res.redirect('/error/500');
                }

            })
            done();
        },
        function (done) {
            req.flash('success', 'Your email is verified. Now you can log in!');
            res.redirect('/login');
        }
    ])
})

/*
    *Resend verification email GET
*/
router.get('/verification-resend', function (req, res) {
    res.render('pages/resend_verify_email', {
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
    });
});

/*
    *Resend verification email POST
*/

router.post('/verification-resend', function (req, res) {
        var service = new account_service();
        var email = req.body.email;
        var verify_token = uuid.v1();
        async.waterfall([
        function (done) {
                var token = uuid.v1();
                service.getByEmail({
                    "Email": email
                }, function (err, data) {
                    if (err == -1) {
                        res.redirect('/error/500');
                    }
                    var user = data;
                    if (!user) {
                        req.flash('error', 'Sorry, we couldn\'t find an account matching the email address you entered. Please try again or register a new account.');
                        return res.redirect('/verification-resend');
                    }
                    if (user.IsConfirmed == 1) {
                        req.flash('error', 'This account has been confirmed.');
                        return res.redirect('/verification-resend');
                    }
                    user.VerifyToken = verify_token;
                    done(null, user);
                })

        },
        function (user, done) {
                service.updateUser(user, function (flag, err) {
                    if (flag == -1) {
                        res.redirect('/error/500');
                    }
                });
                done(null, user);
        },
        function (user, done) {
                //console.log(user.VerifyToken);
                service.sendMail(email, user.VerifyToken, req, res);
                done();
        },
        function () {
                req.flash('success', 'We emailed a link to you. Please check your email and click the link to verify your email address.');
                res.redirect('/verification-resend');
    }
    ])

    })
    /*
        * Change password GET
    */

router.get('/change-password', function (req, res) {
    res.render('pages/change_password', {
        user: req.user,
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
    })
});

/*
    * Change password POST
*/

router.post('/change-password', function (req, res) {
    var username = req.user.Username;
    var password_old = req.body.old_pass;
    var service = new account_service();
    async.waterfall([
        function (done) {
            service.getByUsername({
                "Username": username
            }, function (flag, data) {
                if (flag == -1) {
                    return res.redirect('/error/500');
                }
                if (!bcrypt.compareSync(req.body.old_pass, data.PasswordHash)) {
                    req.flash('error', 'Wrong password');
                    return res.redirect('/change-password');
                }
                if (bcrypt.compareSync(req.body.old_pass, data.PasswordHash)) {
                    data.PasswordHash = bcrypt.hashSync(req.body.new_pass);
                }
                done(null, data);
            })
        },
        function (data, done) {
            service.updateUser(data, function (flag, err) {
                if (flag == -1) {
                    res.redirect('/server_error_500')
                }

                req.flash('success', 'Your password has been changed.');
                return res.redirect('/change-password');
            })
        }
    ])
});

/*
    * Update profile GET
*/
router.get('/update-profile', function (req, res) {
    var service = new account_service();
    service.getByUsername({
        "Username": req.user.Username
    }, function (err, data) {
         return res.render('pages/update_profile', {
            user: data,
            successMessage: req.flash('success')
        });
    })

});
/*
    *Update profile POST
*/

router.post('/update-profile', function (req, res) {
    var service = new account_service();
    var username = req.user.Username;
    service.getByUsername({
        "Username": username
    }, function (flag, data) {
        if (flag == -1) {
            return res.redirect('/server_error_500');
        }
        //console.log(data);
        data.Firstname = req.body.firstname;
        data.Lastname = req.body.lastname;

        service.updateUser(data, function (flag, err) {
            if (flag == -1) {
                res.redirect('/server_error_500')
            }
            req.flash('success', 'Your profile has been updated.');
            res.redirect('/update-profile');
        });
    })
});

/*
    *Forgot Password GET
*/
 
router.get('/forgot', function (req, res) {
    if (req.isAuthenticated()) return res.redirect('/cv');
    res.render('pages/forgot_password', {
        title: 'Forgot Password',
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
    });
});
/*
    *Forgot Password POST
*/

router.post('/forgot', function (req, res, next) {
    var service = new account_service();
    var email = req.body.email;
    async.waterfall([
        function (done) {
            var token = uuid.v1();
            var model = new user_model();
            service.getByEmail({
                "Email": email
            }, function (err, data) {
                if (err == -1) {
                    res.redirect('/error/500');
                }

                var user = data;
                var date = new Date();

                if (!user) {
                    req.flash('error', 'Sorry, we couldn\'t find an account matching the email address you entered. Please try again or register a new account.');
                    return res.redirect('/forgot');
                }

                if (user.ResetPasswordExpire) {
                    var date_differ = (user.ResetPasswordExpire - date) / 60000;
                    if (date_differ > 29 && date_differ <= 30) {
                        req.flash('error', 'We\'ve received too many password reset attempts. Please try again a few minutes later.');
                        return res.redirect('/forgot');
                    }
                }

                date.setMinutes(date.getMinutes() + 30);
                user.ResetPasswordToken = token;
                user.ResetPasswordExpire = date; // 30 mins

                done(null, user);
            });
        },
        function (user, done) {
            service.updateUser(user, function (err, data) {
                if (err == -1) {
                    res.redirect('/error/500');
                }
                done(null, user);
            });
        },
        function (user, done) {
            service.sendResetPassword(email, user.ResetPasswordToken, req, res);
            done();
        }
    ], function () {
        req.flash('success', 'You should receive Password Reset instructions in a few moments. If you don\'t receive an email soon, please try again. If you continue to have problems after that, please contact support.');
        res.redirect('/forgot');
    });
});

/*
    *Reset Password GET
*/ 
router.get('/reset/:token', function (req, res) {
    var service = new account_service();
    service.getByResetPassToken({
        "ResetPasswordToken": req.params.token
    }, function (err, data) {
        if (err == -1) {
            res.redirect('/error/500');
        }
        var user = data;
        var now = new Date();
        if (!user) {
            req.flash('error', 'Password reset token is invalid.');
            return res.redirect('/forgot');
        }
        if (user.ResetPasswordExpire < now) {
            req.flash('error', 'Password reset token has expired.');
            return res.redirect('/forgot');
        }

        res.render('pages/reset_password');
    })
});

/*
    *Reset Password POST
*/
router.post('/reset/:token', function (req, res) {
    var service = new account_service();
    async.waterfall([
        function (done) {
            service.getByResetPassToken({
                "ResetPasswordToken": req.params.token
            }, function (err, data) {
                if (err == -1) {
                    res.redirect('/error/500');
                }
                var user = data;
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('/forgot');
                }

                user.PasswordHash = bcrypt.hashSync(req.body.password);
                user.ResetPasswordToken = '';

                done(null, user);
            })

        },
        function (user, done) {
            service.updateUser(user, function (err, data) {
                if (err == -1) {
                    res.redirect('/error/500');
                }
                done(null, user);
            });
        },
        function (user, done) {
            app.mailer.send('pages/reset_password_success_email', {
                to: user.Email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                subject: 'CV Maker - Password Changed'
            }, function (err) {
                // handle error 
                if (err) {
                    return res.redirect('/error/500');
                }
                done();
            });
        }
    ], function () {
        req.flash('success', 'Your password was changed successfully. You may now login.');
        res.redirect('/login');
    });
});
/*
    *Log out
*/
router.get('/logout', function (req, res) {
    req.logOut();
    req.session.destroy();
    return res.redirect('/');
});

module.exports = router;