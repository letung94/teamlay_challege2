var cv_section = require('../model/cv_section');

function cv_section_service() {
    this.getAllByCVId = function (params, callback) {
        var s = new cv_section();
        s.getAllByCVId(params, callback);
    }
    /*
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
    }*/
    this.changeOrder = function(params1,params2,callback){
    	var cv_section_update1 = new cv_section(params1.CV_Id,
	    params1.Section_Id,
	    params1.IsDeleted,
	    params1.Order);
        var cv_section_update2 = new cv_section(params2.CV_Id,
	    params2.Section_Id,
	    params2.IsDeleted,
	    params2.Order);
        
	    var valid1 = cv_section_update1.checkValidation();
        var valid2 = cv_section_update2.checkValidation();
	    if(valid1&&valid2){
            var databack1 = {error: null, data: null};
            var databack2 = {error: null, data: null};
	        cv_section_update1.update(params1.Id, function(error, data){
                databack1.error = error;
                databack1.data = data;
                cv_section_update2.update(params2.Id, function(error, data){
                databack2.error = error;
                databack2.data = data;
                callback(databack1,databack2);
            });
            });
	    }else{
            callback(cv_section_update1.attrvalidate, cv_section_update3.attrvalidate)
	    }
    }
    
    this.createlistCV_Section_CV_Id = function(params, callback){
        var cv_sectionlist = new cv_section();
        cv_sectionlist.createlistCV_Section_CV_Id(params,callback);
    }
    
    /*
    this.delete = function(params,callback){
    	var skill_delete = new skill();
        skill_delete.delete(params, callback);
    }*/
}

module.exports = cv_section_service;
