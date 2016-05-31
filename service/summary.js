var summaryModel = require('../model/summary');

function summary_service(){
    this.getByIdCV = function(param, cb){
        var s = new summaryModel();
        s.getByIdCV(param.CV_Id, cb);
    }
}

module.exports = summary_service;
