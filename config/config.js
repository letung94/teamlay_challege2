var di = require("di4js");
var mysqlmodel = require('../helper/mysql-model');
var db = require("../model/db");
var ctrluser = require("../controller/ctrluser");
var user = require('../model/user');
var cv = require('../model/cv');
var ctrluser = require("../controller/ctrluser");
var user_service = require('../service/user');
var cv_service = require('../service/cv');
var certification_service = require('../service/certification');
var education_service = require('../service/education');
var contact_info_service = require('../service/contact_info');
var curriculum_vitae_service = require('../service/cv');
var exp_service = require('../service/experience');
var sum_service = require('../service/summary');
var skill_service = require('../service/skill');
var project_service = require('../service/project');

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
    .instance(user)
    .register('certification')
    .instance(certification_service)
    .register('education')
    .instance(education_service)
    .register('contact_info')
    .instance(contact_info_service)
    .register('experience')
    .instance(exp_service)
    .register('summary')
    .instance(sum_service)
    .register('skill')
    .instance(skill_service)
    .register('curriculum_vitae')
    .instance(curriculum_vitae_service)
    .register('project')
    .instance(project_service);

module.exports = di;