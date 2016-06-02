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
        console.log(typeof(data));
        var data_json = JSON.stringify(data);
        var json = JSON.parse(data_json);
        console.log(typeof(json));
        res.render('pages/admin', {
            jsonData: json
        });
    })


    // console.log('entered!');

});


module.exports = router;