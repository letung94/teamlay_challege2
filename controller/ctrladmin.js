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



router.get('/admin', function(req, res) {

    user_model.getAllUser(function(data) {
        //console.log(data);
        res.render('pages/admin', {
            jsonData: JSON.stringify(data)
        });
    })


    // console.log('entered!');

});


module.exports = router;