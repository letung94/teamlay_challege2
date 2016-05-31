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
                if (!user) {
                    req.flash('error', 'Sorry, we couldn\'t find an account matching the email address you entered. Please try again or register a new account.');
                    return res.redirect('/forgot');
                }
                console.log(user);
                var date = new Date();
                date.setMinutes(date.getMinutes() + 30);
                user.Token = token;
                user.ResetPasswordExpire = date; // 30 mins
                user_model.updateUser(user);
                done(null, token, user);
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
                req.flash('success', 'Please check your email and follow the instructions to reset your password.');
                done(err, 'done');
            });
        }
    ], function (err) {
        if (err) return next(err);
        res.redirect('/forgot');
    });
});


// Reset Password GET
router.get('/reset_password', function (req, res) {
    res.render('pages/reset_password');
});

// User Registration GET
router.get('/register', function (req, res) {
    res.render('pages/register');
});

// Login GET
router.get('/login', function (req, res) {
    if (req.isAuthenticated()) res.redirect('/index');
    else res.render('pages/login', {
        errorMessage: req.flash('error')
    });
});

// Login POST
router.post('/login', function (req, res, next) {
    console.log('dawdwawdw');
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
    if (!req.isAuthenticated()) res.redirect('/login');
    res.end('Login successfull!');
    user_model.getAllUser(function (data) {
        console.log(data);
    })

})

// Verify email
router.get("/verify/:token", function (req, res, next) {
    var token = req.params.token;
    user_model.getByToken(token, function (err, data) {
        if (!data) res.end('Token is invalid or has been expired');
        else {
            var user = data;
            user.Token = null;
            user.IsConfirmed = true;
            user_model.updateUser(user, function (err) {
            });
            res.end('Confirmation success');
        }
    })
});

// User Registration POST
router.post('/register', authenticate.isEmailExisted, authenticate.isUsernameExisted, function (req, res) {
    passport.authenticate('local', {
        successRedirect: '/index',
        failureRedirect: '/login',
        failureFlash: true
    }, function (err, user, info) {
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
        user_model.addUser(user, function (err) {
            if (err) {
                console.log(err);
                return;
            }
            // Create a link to verify email
            var link = req.protocol + "://" + req.get('host') + "/verify/" + verify_token;

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
                res.end('Email Sent');
            });
            user_model.getByUsername(req.body.username, function (err, data) {
                req.logIn(data, function (err) {
                    if (err) {
                        return res.render('pages/login', { error: req.flash('error', err.message) });
                    } else {
                        return res.redirect('/index');
                    }
                });
            })
        });
    })(req, res);
});

// Logout
router.get('/logout', function (req, res) {
    req.logOut();
    res.redirect('/login');
});

module.exports = router;