var di = require("di4js");
var mysql = require("mysql");
var db = require("../model/db");


di.register('db').as(db).withConstructor().param().val("localhost").param().val("root").param().val("root").
param().val("cv_maker").param().val(mysql)

module.exports = di;