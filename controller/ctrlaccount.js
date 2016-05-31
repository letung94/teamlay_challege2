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


router.get('/forgot', function (req, res) {
    res.render('pages/forgot_password', {
        title: 'Forgot Password',
        error: req.flash('error'),
        success: req.flash('success')
    });
});

router.post('/forgot', function (req, res) {
    var token = uuid.v1();
    user_model.getByEmail(req.body.email, function (err, data) {
        var user = data;
        console.log(user);
        
        if (!user) {
            req.flash('error', 'No account with that email address exists.');
            res.redirect('/forgot');
        }
        else
        {
        
        var date = new Date();
        date.setMinutes(date.getMinutes()+30);
        user.Token = token;
        user.ResetPasswordExpire = date; // 30 mins
        
        user_model.updateUser(user, function (err) {

        });
        var link = req.protocol + "://" + req.get('host') + "/reset/" + token;
        app.mailer.send('pages/reset_password_email', {
            to: 'duybui.hcmit@outlook.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.  
            subject: 'CV Maker Reset Password', // REQUIRED. 
            link: link, // All additional properties are also passed to the template as local variables. 
            email: req.body.email
        }, function (err) {
            if (err) {
                // handle error 
                console.log(err);
                res.end('There was an error sending the email');
                return;
            }
            
        });
        req.flash('success', 'Email sending.');
            res.redirect('/forgot');
        }
    });
});

router.get('/reset_password', function(req, res) {
    res.render('pages/reset_password');
});
router.get('/forgot_password', function(req, res) {
    res.render('pages/forgot_password');
});
router.get('/register', function(req, res) {
    res.render('pages/register');
});

// Logout
router.get('/logout', function (req, res) {
    req.logOut();
    res.redirect('/login');
});
// Sign in GET
router.get('/login', function (req, res) {
    if (req.isAuthenticated()) res.redirect('/index');
    else res.render('pages/login', {
        error: req.flash('error')
    });
});
// Sign in POST
router.post('/login', function (req, res, next) {
    console.log('dawdwawdw');
    passport.authenticate('local', {
        successRedirect: '/index',
        failureRedirect: '/login',
        failureFlash: true
    }, function (err, user, info) {
        if (err) {
            console.log('err');
            return res.render('pages/login', { error: req.flash('error',err.message) });
        }

        if (!user) {
            console.log('!user');
            return res.render('pages/login', { error: req.flash('error','dwadawawd') });
        }

        return req.logIn(user, function (err) {
            if (err) {
                return res.render('pages/login', { error: req.flash('error',err.message) });
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

// Signup user POST
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
            CreatedDate: date,
            IsConfirmed: false,
            IsBlocked: false,
            Token: verify_token
        };
        user_model.addUser(user, function (err) {
            if (err) console.log('Error');
            else console.log('Success');
        });

        // Create a link to verify email
        var link = req.protocol + "://" + req.get('host') + "/verify/" + verify_token;

        app.mailer.send('pages/confirmation_email', {
            to: 'duybui.hcmit@outlook.com', // REQUIRED. This can be a comma delimited string just like a normal email to field.  
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
                    return res.render('pages/login', { error: req.flash('error',err.message) });
                } else {
                    return res.redirect('/index');
                }
            });
        })
    })(req, res);
});

module.exports = router;