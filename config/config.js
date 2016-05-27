var di = require("di4js");
var mysqlmodel = require('mysql-model');
var db = require("../model/db");
<<<<<<< HEAD
=======
var ctrluser = require("../controller/ctrluser");
var user = require('../model/user');
var cv = require('../model/cv');
>>>>>>> 5d2fdac69797233ab4246531ee65348757e276f7

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