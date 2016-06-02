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
    async.waterfall([
        function (done) {
            var token = uuid.v1();
            done(null, token);
        },
        function (token, done) {
            user_model.getByEmail(req.body.email, function (data) {
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

                user_model.updateUser(user, function () {
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
    user_model.getByToken(req.params.token, function (err, data) {
        var user = data;
        var now = new Date();
        console.log(user);
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
            user_model.getByToken(req.params.token, function (err, data) {
                var user = data;
                console.log(user);
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('/forgot');
                }

                user.PasswordHash = bcrypt.hashSync(req.body.password);
                user.Token = '';

                user_model.updateUser(user, function () {
                    console.log(user);
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
                console.log('success');
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
            console.log('err');
            return res.render('pages/login', { errorMessage: err.message });
        }

        if (!user) {
            console.log('!user');
            return res.render('pages/login', { errorMessage: info.message });
        }

        return req.logIn(user, function (err) {
            if (err) {
                return res.render('pages/login', { v: req.flash('error', err.message) });
            } else {
                return res.redirect('/index');
            }
        });
    })(req, res, next);
});

// Index Page
router.get('/index', function (req, res) {
    user_model.getAllUser(function (data) {
        console.log(data);
    })
    if (!req.isAuthenticated()) res.redirect('/login');
    res.end('Login successfull!');
})

// Verify email
router.get("/verify/:token", function (req, res, next) {
    var token = req.params.token;
    user_model.getByToken(token, function (err, data) {
        if (!data) res.end('Token is invalid or has expired');
        else {
            var user = data;
            user.Token = '';
            user.IsConfirmed = true;
            user_model.updateUser(user, function (err) {
            });
            res.end('Confirmation success');
        }
    })
});

// User Registration POST
// router.post('/register', authenticate.isEmailExisted, authenticate.isUsernameExisted, function (req, res) {
//     passport.authenticate('local', {
//         successRedirect: '/index',
//         failureRedirect: '/login',
//         failureFlash: true
//     }, function (err, user, info) {
//         req.body.password = bcrypt.hashSync(req.body.password);
//         var date = new Date();
//         var verify_token = uuid.v1();
//         var user = {
//             Username: req.body.username,
//             Email: req.body.email,
//             PasswordHash: req.body.password,
//             //Firstname = req.body.firstname,
//             //Lastname = req.body.lastname,
//             CreatedDate: date,
//             IsConfirmed: false,
//             IsBlocked: false,
//             Token: verify_token
//         };
//         user_model.addUser(user, function () {
//             // Create a link to verify email
//             var link = req.protocol + "://" + req.get('host') + "/verify/" + verify_token;

//             app.mailer.send('pages/confirmation_email', {
//                 to: req.body.email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
//                 subject: 'CV Maker Confimation Email', // REQUIRED. 
//                 link: link, // All additional properties are also passed to the template as local variables. 
//                 email: req.body.email
//             }, function (err) {
//                 if (err) {
//                     // handle error 
//                     console.log(err);
//                     res.end('There was an error sending the email');
//                     return;
//                 }
//                 res.end('Email Sent');
//             });
//             user_model.getByUsername(req.body.username, function (err, data) {
//                 req.logIn(data, function (err) {
//                     if (err) {
//                         return res.render('pages/login', { error: req.flash('error', err.message) });
//                     } else {
//                         return res.redirect('/index');
//                     }
//                 });
//             });
//         });
//     })(req, res);
// });
router.post('/register', function (req, res) {
    // if (req.body.username == '' || req.body.email == '') {
    //     req.flash('error', 'Please fill all the required.');
    //     return res.redirect('/register');
    // }
    async.waterfall([
        function (done) {
            user_model.getByEmail(req.body.email, function (err, data) {
                if (data) {
                    req.flash('error', 'Email already exists');
                    console.log('email trug');
                    return res.redirect('/register');
                }
                done(err);
            });
        },
        function (done) {
            user_model.getByUsername(req.body.username, function (err, data) {
                if (data) {
                    req.flash('error', 'Username already exists');
                    return res.redirect('/register');
                }
                done(err);
            });
        },
        function (done) {
            console.log(done);
            req.body.password = bcrypt.hashSync(req.body.password);
            var date = new Date();
            var verify_token = uuid.v1();
            var user = {
                Username: req.body.username,
                Email: req.body.email,
                PasswordHash: req.body.password,
                //Firstname = req.body.firstname,
                //Lastname = req.body.lastname,
                CreatedDate: date,
                IsConfirmed: false,
                IsBlocked: false,
                Token: verify_token
            };
            done(null, user);
        },
        function (user, done) {
            user_model.addUser(user, function () {
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
                        console.log(err);
                        res.end('There was an error sending the email');
                        return;
                    }
                    done(err);
                });
            });
        },
        function (done) {
            user_model.getByUsername(req.body.username, function (err, data) {
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