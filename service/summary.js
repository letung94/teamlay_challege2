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
        summary_save.save(summary_save.attribute, callback);
    }
}

module.exports = summary_service;

