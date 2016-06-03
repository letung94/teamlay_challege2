var di = require('../config/config');
var passport = require('passport');
var user_model = di.resolve('user');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

// Passport config
passport.serializeUser(function(user, done) {
    done(null, user.Username);
});

passport.deserializeUser(function(username, done) {
    var model = new user_model();
    model.getByUsername(username, function(err, user) {
        done(null, user);
    })
});

passport.use('local', new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, username, password, done) {
        var model = new user_model();
        model.getByUsername(username, function(err, data) {
            var user = data;
            if (user == null) {
                return done(null, false, {
                    message: 'Invalid username'
                });
            } else {
                if (!bcrypt.compareSync(password, user.PasswordHash)) {
                    return done(null, false, {
                        message: 'Invalid password'
                    });
                } else {
                    return done(null, user);
                }
            }
        })
    }));



module.exports = passport;