var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var authenticate = require('../middleware/authenticate');
var di = require('../config/config');
var passport = require('passport');
var user_model = di.resolve('user');
var LocalStrategy = require('passport-local').Strategy;
var bodyParser = require('body-parser');


passport.serializeUser(function (user, done) {
    done(null, user.Username);
});

passport.deserializeUser(function (username, done) {
    user_model.getByUsername(username, function (err, data) {
		done(null, data);
	})
});

passport.use('local', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},
    function (req, username, password, done) {
        user_model.getByUsername(username, function (err, data) {
			var user = data;
            if (user == null) {
                return done(null, false, { message: 'Invalid username' });
            } else {
                if (!bcrypt.compareSync(password, user.PasswordHash)) {
                    return done(null, false, { message: 'Invalid password' });
                } else {
                    return done(null, user);
                }
            }

        })
    }));



router.get('/logout', function (req, res) {
	req.logOut();
	res.redirect('/login');
});

router.get('/login', function (req, res) {
    console.log(req.isAuthenticated());
	if (req.isAuthenticated()) res.redirect('/index');
	else res.render('pages/login', {});
    
});

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
				return res.render('pages/login', { errorMessage: err.message });
			} else {
				return res.redirect('/index');
			}
		});
	})(req, res, next);
});

router.get('/index', function (req, res) {
	if (!req.isAuthenticated()) res.redirect('/login');
	res.end('Login successfull!');
	user_model.getAllUser(function (data) {
		console.log(data);
	})
    console.log(req.isAuthenticated());
})

router.post('/signup', authenticate.isEmailExisted, authenticate.isUsernameExisted, function (req, res) {
	passport.authenticate('local', {
		successRedirect: '/index',
		failureRedirect: '/login',
		failureFlash: true
	}, function (err, user, info) {
		req.body.password = bcrypt.hashSync(req.body.password);
        var date = new Date();
		var user = {
            Username: req.body.username,
            Email: req.body.email,
            PasswordHash: req.body.password,
            CreatedDate: date,
            IsConfirmed: false,
            IsBlocked: false
        };
        user_model.addUser(user, function (err) {
			if (err) console.log('Error');
			else console.log('Success');
		});
		user_model.getByUsername(req.body.username,function(err,data){
			req.logIn(data, function (err) {
			if (err) {
				return res.render('pages/login', { errorMessage: err.message });
			} else {
				return res.redirect('/index');
			}
		});
		})
	})(req, res);
});

module.exports = router;