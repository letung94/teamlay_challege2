var di = require("di4js");
var mysqlmodel = require('mysql-model');
var db = require("../model/db");


var ctrluser = require("../controller/ctrluser");

var user_service = require('../service/user');
var cv_service = require('../service/cv');
var cer_service = require('../service/certification');

di
    .register('db')
        .as(db)
            .withConstructor()
                .param().val("localhost")
                .param().val("root")
                .param().val("root")
                .param().val("cv_maker")
                .param().val(mysqlmodel)
    .register('user')
        .as(user_service)
    .register('certification')
        .instance(cer_service)
    .register('cv')
        .as(cv_service);

module.exports = di;
