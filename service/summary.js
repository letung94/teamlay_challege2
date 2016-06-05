var summaryModel = require('../model/summary');

function summary_service(){
    this.getByIdCV = function(param, cb){
        var c = new summaryModel();
        c.getByIdCV(param.CV_Id, cb);
    }
    this.save = function(param,callback){
        var summary_save = new summaryModel(param.Headline,
        param.ProfessionalSummary,
        param.CV_Id);
        var valid = summary_save.checkValidation();
        if (valid) {
            summary_save.save(summary_save.attribute, callback);
        }else {
            callback(0,summary_save.attrivalidate);   
        }    
    }
}

module.exports = summary_service;

