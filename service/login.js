var user_model = require('../model/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

passport.use(new LocalStrategy(
    function (username, password, done) {
        var model = new user_model();
        model.getByUsername({
            username: username
        }, function (err, user) {
            if (err) {
                return done(err, {
                    message: 'Invalid username or password'
                });
            } else {
                if (!user || !bcrypt.compareSync(password, user.PasswordHash)) {
                    return done(null, false, {
                        message: 'Invalid username or password'
                    });
                }
            }

            return done(null, user);
        });
    }
));

module.exports = passport;