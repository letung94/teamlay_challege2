<<<<<<< HEAD
var summaryModel = require('../model/summary');

function summary_service(){
    this.getByIdCV = function(param, cb){
        var s = new summaryModel();
        s.getByIdCV(param.CV_Id, cb);
    }
}

module.exports = summary_service;
=======
var summary = require('../model/summary');

function summary_service() {
    this.getAllSummaryByCVId = function (params, callback) {
        var s = new summary();
        s.getAllSummaryByCVId(params, callback);
    }
}

module.exports = summary_service;
>>>>>>> 8971e05c961d5e46fd029a5d271b39c70cef4692
