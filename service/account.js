var user_model = require('../model/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var mailer = require('express-mailer');
var app = require('../server');

function account_service(arguments) {
    this.getByUsername = function (param, callback) {
            var model = new user_model();
            model.getByUsername(param.Username, callback);
        }
        //get email
    this.getByEmail = function (param, callback) {
            var model = new user_model();
            model.getByEmail(param.Email, callback);
        }
        //get verify token
    this.getVerifyToken = function (param, callback) {
        var model = new user_model();
        model.getByVerifyToken(param.VerifyToken, callback)
    }

    this.getByResetPassToken = function (param, callback) {
            var model = new user_model();
            model.getByResetPassToken(param.ResetPasswordToken, callback)
        }
        //add
    this.addUser = function (param, callback) {
            var model = new user_model(
                param.Firstname,
                param.Lastname,
                param.Username,
                param.Email,
                param.PasswordHash,
                param.CreatedDate,
                param.VerifyToken,
                param.IsConfirmed,
                param.IsBlocked
            );
            var valid = model.checkValidation();
            if (valid) {
                model.addUser(model.attribute, callback);
            } else {

                callback(0, model.attrivalidate);
            }
        }
        //send mail
    this.sendMail = function (email, token, req, res) {
            var link = req.protocol + "://" + req.get('host') + "/verify/" + token;
            app.mailer.send('pages/confirmation_email', {
                to: email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                subject: 'CV Maker Confimation Email', // REQUIRED. 
                link: link, // All additional properties are also passed to the template as local variables. 
                email: email
            }, function (err) {
                if (err) {
                    // handle error 
                    return res.redirect('/error/500');
                }
            });
        }
        //send mail
    this.sendResetPassword = function (email, token, req, res) {
            var link = req.protocol + "://" + req.get('host') + "/reset/" + token;
            app.mailer.send('pages/reset_password_email', {
                to: email, // REQUIRED. This can be a comma delimited string just like a normal email to field.  
                subject: 'CV Maker Reset Password', // REQUIRED. 
                link: link, // All additional properties are also passed to the template as local variables. 
                email: email
            }, function (err) {
                if (err) {
                    // handle error 
                    return res.redirect('/error/500');
                }
            });
        }
        //update User
    this.updateUser = function (param, callback) {
        var model = new user_model();
        model.updateUser(param, callback);
    }
}



module.exports = account_service;