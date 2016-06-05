var experience = require('../model/experience');

function experience_service() {
    this.getAllExperienceByCVId = function (params, callback) {
        var e = new experience();
        e.getAllExperienceByCVId(params, callback);
    }
    this.saveExperience = function (params, callback) {
        var e = new experience(params.Company,
        params.Designation,
        params.FromDate,
        params.ToDate,
        params.Details,
        params.CV_Id);
        var valid = e.checkValidation();
        if(valid){
            e.saveExperience(e.attribute, callback);
        }
        else{
            callback(0, e.attrvalidate);
        }
    }
    this.updateExperience = function (params, callback){
        var e = new experience(params.Company,
        params.Designation,
        params.FromDate,
        params.ToDate,
        params.Details,
        params.CV_Id);
        var valid = e.checkValidation();
         if(valid){
            e.updateExperience(params.Id, callback);
        }
        else{
            callback(0, e.attrvalidate);
        }

    }
    this.deleteExperience = function(params, callback){
        var e = new experience();
        e.deleteExperience(params, callback);
    }
}

module.exports = experience_service;
