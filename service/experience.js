var experience = require('../model/experience');

function experience_service() {
    this.getAllExperienceByCVId = function (params, callback) {
        var e = new experience();
        e.getAllExperienceByCVId(params, callback);
    }
    this.saveExperience = function (params, callback) {
        var e = new experience();
        e.saveExperience(params, callback);
    }
    this.deleteExperience = function(id, callback){
        var e = new experience();
        e.deleteExperience(id, callback);
    }
}

module.exports = experience_service;