var skill = require('../model/skill');

function skill_service() {
    this.getAllSkillByCVId = function (params, callback) {
        var s = new skill();
        s.getAllByIdCV(params, callback);
    }
}

module.exports = skill_service;
