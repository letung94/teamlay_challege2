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

// Resend verification email GET
router.get('/verification-resend', function (req, res) {
    if (req.isAuthenticated()) return res.redirect('/cv');
    res.render('pages/resend_verify_email', {
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
    });
});

// Resend verification email POST
router.post('/verification-resend', function (req, res) {
    async.waterfall([
        function (done) {
            var token = uuid.v1();
            var model = new user_model();
            model.getByEmail(req.body.email, function (err, data) {
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
                user.VerifyToken = token;
                done(null, user);
            });
        },
        function (user, done) {
            var model = new user_model();
            model.updateUser(user, function (flag, err) {
                if (flag == -1) {
                    res.redirect('/error/500');
                }
            });
            done(null, user);
        },
        function (user, done) {
            // Create a link to verify email
            var link = req.protocol + "://" + req.get('host') + "/verify/" + user.VerifyToken;

            app.mailer.send('pages/confirmation_email', {
                to: req.body.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                subject: 'CV Maker Confimation Email', // REQUIRED. 
                link: link, // All additional properties are also passed to the template as local variables. 
                email: req.body.email
            }, function (err) {
                if (err) {
                    // handle error 
                    return res.redirect('/error/500');
                }
                done();
            });
        }
    ], function () {
        req.flash('success', 'We emailed a link to you. Please check your email and click the link to verify your email address.');
        res.redirect('/verification-resend');
    });
});

// Forgot Password GET
router.get('/forgot', function (req, res) {
    if (req.isAuthenticated()) return res.redirect('/cv');
    res.render('pages/forgot_password', {
        title: 'Forgot Password',
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
    });
});

// Forgot Password POST
router.post('/forgot', function (req, res, next) {
    async.waterfall([
        function (done) {
            var token = uuid.v1();
            var model = new user_model();
            model.getByEmail(req.body.email, function (err, data) {
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
            var model = new user_model();
            model.updateUser(user, function (err, data) {
                if (err == -1) {
                    res.redirect('/error/500');
                }
                done(null, user);
            });
        },
        function (user, done) {
            var link = req.protocol + "://" + req.get('host') + "/reset/" + user.ResetPasswordToken;
            app.mailer.send('pages/reset_password_email', {
                to: req.body.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                subject: 'CV Maker Reset Password', // REQUIRED. 
                link: link, // All additional properties are also passed to the template as local variables. 
                email: req.body.email
            }, function (err) {
                if (err) {
                    // handle error 
                    return res.redirect('/error/500');
                }
                done();
            });
        }
    ], function () {
        req.flash('success', 'You should receive Password Reset instructions in a few moments. If you don\'t receive an email soon, please try again. If you continue to have problems after that, please contact support.');
        res.redirect('/forgot');
    });
});

// Reset Password GET
router.get('/reset/:token', function (req, res) {
    var model = new user_model();
    model.getByResetPassToken(req.params.token, function (err, data) {
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

// Reset Password POST
router.post('/reset/:token', function (req, res) {
    async.waterfall([
        function (done) {
            var model = new user_model();
            model.getByResetPassToken(req.params.token, function (err, data) {
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
            var model = new user_model();
            model.updateUser(user, function (err, data) {
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

// User Registration GET
router.get('/register', function (req, res) {
    if (req.isAuthenticated()) return res.redirect('/cv');
    res.render('pages/register', {
        errorMessage: req.flash('error')
    });
});

// Login GET
router.get('/login', function (req, res) {
    if (req.isAuthenticated()) return res.redirect('/cv');
     res.render('pages/login', {
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
    });
});

// Login POST
router.post('/login', function (req, res, next) {
    if (req.body.remember) req.session.cookie.maxAge = 365 * 24 * 60 * 60 * 1000;
    passport.authenticate('local', {
        successRedirect: '/cv',
        failureRedirect: '/login',
        failureFlash: true

    }, function (err, user, info) {
        if (err) {
            return res.render('pages/login', { errorMessage: err.message });
        }

        if (!user) {
            return res.render('pages/login', { errorMessage: info.message });
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


// Verify email
router.get("/verify/:token", function (req, res, next) {
    async.waterfall([
        function (done) {
            var model = new user_model();
            var token = req.params.token;
            model.getByVerifyToken(token, function (flag, data) {
                if (flag == -1) {
                    res.redirect('/error/500');
                }

                if (!data) {
                    res.render('pages/notification', { noti_message: 'Token is invalid or has expired' });
                    return;
                }

                var user = data;
                user.VerifyToken = '';
                user.IsConfirmed = 1;
                done(null, user);
            })
        },
        function (user, done) {
            var model = new user_model();
            model.updateUser(user, function (flag, data) {
                if (flag == -1) {
                    return res.redirect('/error/500');
                }

            });
            done();
        }
    ], function () {
        req.flash('success', 'Your email is verified. Now you can log in!');
        res.redirect('/login');
    });
});

// User Registration POST
router.post('/register', function (req, res) {
    async.waterfall([
        function (done) {
            var model = new user_model();
            model.getByEmail(req.body.email, function (err, data) {
                if (data) {
                    req.flash('error', 'Email already exists');
                    return res.redirect('/register');
                }
                done();
            });
        },
        function (done) {
            var model = new user_model();
            model.getByUsername(req.body.username, function (flag, data) {
                if (flag == -1) {
                    res.redirect('/error/500');
                }
                if (data) {
                    req.flash('error', 'Username already exists');
                    return res.redirect('/register');
                }
                done();
            });
        },
        function (done) {
            req.body.password = bcrypt.hashSync(req.body.password);
            var date = new Date();
            var verify_token = uuid.v1();
            var user = new user_model(
                req.body.firstname,
                req.body.lastname,
                req.body.username,
                req.body.email,
                req.body.password,
                date,
                verify_token,
                0,
                0,
                null,
                null);
            done(null, user);
        },
        function (user, done) {
            var valid = user.checkValidation();
            if (valid) {
                user.addUser(user.attribute, function (err, data) {
                    if (err == -1) {
                        res.redirect('/error/500');
                    };

                    // Create a link to verify email
                    var link = req.protocol + "://" + req.get('host') + "/verify/" + user.attribute.VerifyToken;
                    app.mailer.send('pages/confirmation_email', {
                        to: req.body.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                        subject: 'CV Maker Confimation Email', // REQUIRED. 
                        link: link, // All additional properties are also passed to the template as local variables. 
                        email: req.body.email
                    }, function (err) {
                        if (err) {
                            // handle error 
                            return res.redirect('/error/500');
                        }
                        done();
                    });
                });
            } else {
                return res.redirect('/error/500');
            }
        },
        function () {
            req.flash('success', 'We emailed a link to you. Please check your email and click the link to verify your email address.');
            return res.redirect('/login');
        }
    ]);
});

// Update profile GET
router.get('/update-profile', function (req, res) {
    res.render('pages/update_profile', {
        user: req.user,
        successMessage: req.flash('success')
    });
});

// Update profile POST
router.post('/update-profile', function (req, res) {
    var user = new user_model();
    user.getByUsername(req.user.Username, function (flag, data) {
        if (flag == -1) {
            return res.redirect('/server_error_500');
        }
        data.Firstname = req.body.firstname;
        data.Lastname = req.body.lastname;

        var user_update = new user_model();
        user_update.updateUser(data, function (flag, err) {
            if (flag == -1) {
                res.redirect('/server_error_500')
            }
            req.flash('success', 'Your profile has been updated.');
            res.redirect('/update-profile');
        });
    })
});

// Change password GET
router.get('/change-password', function (req, res) {
    res.render('pages/change_password', {
        user: req.user,
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
    })
});

// Change password POST
router.post('/change-password', function (req, res) {
    var user = new user_model();
    user.getByUsername(req.user.Username, function (flag, data) {
        if (flag == -1) {
            return res.redirect('/server_error_500');
        }

        if(!bcrypt.compareSync(req.body.old_pass, data.PasswordHash)){
            req.flash('error','Wrong password');
            return res.redirect('/change-password');
        }
        
        data.PasswordHash = bcrypt.hashSync(req.body.new_pass);

        var user_update = new user_model();
        user_update.updateUser(data, function (flag, err) {
            if (flag == -1) {
                res.redirect('/server_error_500')
            }
            
            req.flash('success', 'Your password has been changed.');
            return res.redirect('/change-password');
        });
    })
});

// Logout
router.get('/logout', function (req, res) {
    req.logOut();
    req.session.destroy();
    return res.redirect('/');
});

module.exports = router;