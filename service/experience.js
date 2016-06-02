var experience = require('../model/experience');

function experience_service() {
    this.getAllExperienceByCVId = function (params, callback) {
        var e = new experience();
        e.getAllByIdCV(params.CV_Id, callback);
    }
    this.createExperience = function (params, callback) {
        var e = new experience();
        e.createExperience(params, callback);
    }
}

module.exports = experience_service;
