function summaryModel(){
    var Summary = require('../config/config').resolve("db").Summary;
    this.getAllSummaryByCVId = function (params, callback) {
        summary = new Summary();
        summary.find('all', {fields: ['Headline', 'ProfessionalSummary'], where: 'CV_id = ' + params.CV_Id}, function (err, rows, fields) {
           callback(rows); 
        });
    }
        
}

module.exports = summaryModel;