var di = require("di4js");
var mysqlmodel = require('mysql-model');
var db = require("../model/db");

var ctrluser = require("../controller/ctrluser");

var user_service = require('../service/user');
var cv_service = require('../service/cv');
var certification_service = require('../service/certification');
var education_service = require('../service/education');
var contact_info_service = require('../service/contact_info');

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
        .instance(certification_service)
    .register('education')
        .instance(education_service)
    .register('cv')
        .as(cv_service)
    .register('contact_info')
        .instance(contact_info_service);

module.exports = di;
