var di = require("di4js");
var mysql = require("mysql");
var db = require("../model/db");
var ctrluser = require("../controller/ctrluser");


di.register('db').as(db).withConstructor().param().val("localhost").param().val("root").param().val("rot").
param().val("cv_maker").param().val(mysql);

module.exports = di;