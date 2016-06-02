var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var authenticate = require('../middleware/authenticate');
var di = require('../config/config');
var passport = require('../config/passport_authenticate');
var user_model = di.resolve('user');
var uuid = require('node-uuid');
var mailer = require('express-mailer');
var app = require('../server');
var flash = require('express-flash');
var async = require('async');

// Forgot Password GET
router.get('/forgot', function (req, res) {
    res.render('pages/forgot_password', {
        title: 'Forgot Password',
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
    });
});

// Forgot Password POST
router.post('/forgot', function (req, res, next) {
    var model = new user_model();
    async.waterfall([
        function (done) {
            var token = uuid.v1();
            done(null, token);
        },
        function (token, done) {
            model.getByEmail(req.body.email, function (err, data) {
                if (err == -1) {
                    res.render('pages/server_error_500');
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
                user.Token = token;
                user.ResetPasswordExpire = date; // 30 mins

                model.updateUser(user, function (err, data) {
                    if (err == -1) {
                        res.render('pages/server_error_500');
                    }
                    done(null, token, user);
                });

            });
        },
        function (token, user, done) {
            var link = req.protocol + "://" + req.get('host') + "/reset/" + token;
            app.mailer.send('pages/reset_password_email', {
                to: req.body.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                subject: 'CV Maker Reset Password', // REQUIRED. 
                link: link, // All additional properties are also passed to the template as local variables. 
                email: req.body.email
            }, function (err) {
                // handle error 
                req.flash('success', 'You should receive Password Reset instructions in a few moments. If you don\'t receive an email soon, please try again. If you continue to have problems after that, please contact support.');
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});

// Reset Password GET
router.get('/reset/:token', function (req, res) {
    var model = new user_model();
    model.getByToken(req.params.token, function (err, data) {
        if (err == -1) {
            res.render('pages/server_error_500');
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
    var model = new user_model();
    async.waterfall([
        function (done) {
            model.getByToken(req.params.token, function (err, data) {
                if (err == -1) {
                    res.render('pages/server_error_500');
                }

                var user = data;
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('/forgot');
                }

                user.PasswordHash = bcrypt.hashSync(req.body.password);
                user.Token = '';

                model.updateUser(user, function () {
                    if (err == -1) {
                        res.render('pages/server_error_500');
                    }
                    done(null, user);
                });
            })
        },
        function (user, done) {
            app.mailer.send('pages/reset_password_success_email', {
                to: user.Email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                subject: 'CV Maker - Password Changed'
            }, function (err) {
                // handle error 
                req.flash('success', 'Your password was changed successfully. You may now login.');
                done(err);
            });
        }
    ], function (err) {
        res.redirect('/login');
    });
});

// User Registration GET
router.get('/register', function (req, res) {
    res.render('pages/register', {
        errorMessage: req.flash('error')
    });
});

// Login GET
router.get('/login', function (req, res) {
    if (req.isAuthenticated()) res.redirect('/index');
    else res.render('pages/login', {
        errorMessage: req.flash('error'),
        successMessage: req.flash('success')
    });
});

// Login POST
router.post('/login', function (req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/index',
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

// Index Page
router.get('/index', function (req, res) {
    var model = new user_model();
    model.getAllUser(function (err, data) {
        if (err == -1) {
            res.render('pages/server_error_500');
        }
        console.log(data);
    })
    if (!req.isAuthenticated()) res.redirect('/login');
    res.end('Login successfull!');
})

// Verify email
router.get("/verify/:token", function (req, res, next) {
    var model = new user_model();
    var token = req.params.token;
    model.getByToken(token, function (err, data) {
        if (err == -1) {
            res.render('pages/server_error_500');
        }

        if (!data) {
            res.render('pages/notification', { noti_message: 'Token is invalid or has expired' });
        }
        else {
            var user = data;
            user.Token = '';
            user.IsConfirmed = 1;
            model.updateUser(user, function (err, data) {
                if (err == -1) {
                    res.render('pages/server_error_500');
                }
            });
            res.redirect('/cv');
        }
    })
});

// User Registration POST
router.post('/register', function (req, res) {
    model = new user_model();
    async.waterfall([
        function (done) {
            model.getByEmail(req.body.email, function (err, data) {
                if (data) {
                    req.flash('error', 'Email already exists');
                    return res.redirect('/register');
                }
                done();
            });
        },
        function (done) {
            model.getByUsername(req.body.username, function (errFlag, data) {
                if (errFlag == -1) {
                    res.render('pages/server_error_500');
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
                null);
            done(null, user);
        },
        function (user, done) {
            console.log(user.checkValidation());
            console.log(user.attribute);
            user.addUser(user.attribute, function (err, data) {
                if (err == -1) {
                    res.render('pages/server_error_500');
                };

                // Create a link to verify email
                var link = req.protocol + "://" + req.get('host') + "/verify/" + user.Token;

                app.mailer.send('pages/confirmation_email', {
                    to: req.body.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                    subject: 'CV Maker Confimation Email', // REQUIRED. 
                    link: link, // All additional properties are also passed to the template as local variables. 
                    email: req.body.email
                }, function (err) {
                    if (err) {
                        // handle error 
                        res.render('pages/server_error_500');
                        return;
                    }
                    done();
                });
            });
        },
        function (done) {
            model.getByUsername(req.body.username, function (err, data) {
                req.logIn(data, function (err) {
                    if (err) {
                        req.flash('error', err.message);
                        return res.redirect('/login');
                    } else {
                        return res.redirect('/email-verification');
                    }
                });
                done();
            });
        }
    ]);
});

// Wating confirmation GET
router.get('/email-verification', function (req, res) {
    res.render('pages/waiting_confirmation');
});

// Logout
router.get('/logout', function (req, res) {
    req.logOut();
    res.redirect('/login');
});

module.exports = router;