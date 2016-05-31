function skillModel(){
    var Skill = require('../config/config').resolve("db").Skill;
    this.getAllSkillByCVId = function (params, callback) {
        skill = new Skill();
        skill.find('all', {fields: ['Name', 'Level', 'Maturity'], where: 'CV_id = ' + params.CV_Id}, function (err, rows, fields) {
           callback(rows); 
        });
    }
        
}

module.exports = skillModel;