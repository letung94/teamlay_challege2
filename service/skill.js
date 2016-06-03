var skill = require('../model/skill');

function skill_service() {
    this.getAllSkillByCVId = function (params, callback) {
        var s = new skill();
        s.getAllByIdCV(params, callback);
    }
    this.save = function(params,callback){
    	var skill_save = new skill(params.Name,
	    params.Expertise,
	    params.Experience,
	    params.LastYearUsed,
	    params.CV_Id);
	    var valid = skill_save.checkValidation();
	    if(valid){
	        skill_save.save(skill_save.attribute, callback);
	    }else{

	        callback(0, skill_save.attrvalidate);
	    }
    }
    this.update = function(params,callback){
    	var skill_update = new skill(params.Name,
	    params.Expertise,
	    params.Experience,
	    params.LastYearUsed,
	    params.CV_Id);
	    var valid = skill_update.checkValidation();
	    if(valid){
	        skill_update.update(params.Id, callback);
	    }else{

	        callback(0, skill_update.attrvalidate);
	    }
    }
    this.delete = function(params,callback){
    	var skill_delete = new skill();
        skill_delete.delete(params, callback);
    }
}

module.exports = skill_service;
