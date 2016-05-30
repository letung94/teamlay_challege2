var educationModel = require('../model/education');

function education_service(){
    this.getAllEducationByCVId = function(param, cb){
        var c = new educationModel();
        c.getAllEdutcationByCVId(param, cb);
    }
}

module.exports = education_service;
