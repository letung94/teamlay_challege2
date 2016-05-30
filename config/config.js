var di = require("di4js");
var mysqlmodel = require('mysql-model');
var db = require("../model/db");
var ctrluser = require("../controller/ctrluser");
var user = require('../model/user');
var cv = require('../model/cv');



var ctrluser = require("../controller/ctrluser");

var user = require('../service/user');
var cv = require('../service/cv');


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
        .as(user)
    .register('cv')
        .as(cv);

module.exports = di;