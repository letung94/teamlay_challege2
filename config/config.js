var di = require("di4js");
var mysqlmodel = require('mysql-model');
var db = require("../model/db");
var ctrluser = require("../controller/ctrluser");
var user = require('../model/user');

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
        .as(user);

module.exports = di;