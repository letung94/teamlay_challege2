function skillModel(){
    var Skill = require('../config/config').resolve("db").Skill;
    this.getAllSkillByCVId = function (params, callback) {
        skill = new Skill();
        skill.find('all', {fields: ['Id', 'Name', 'Expertise', 'Experience', 'LastYearUsed', 'CV_Id'], where: 'CV_id = ' + params.CV_Id}, function (err, rows, fields) {
            if(err){
                return (-1, rows);
            }else{
                callback(1, rows);
            }
        });
    }
}

module.exports = skillModel;
