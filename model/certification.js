function certificationModel() {
    // console.log('in');
    var Certification = require('../config/config').resolve("db").Certification;
    this.getAllCertificationByCVId = function (param, callback) { // param: CV_Id,
        certification = new Certification();
        certification.find('all',{where:'CV_Id=' + param.CV_Id},function(err,rows,fields){
            callback(rows);
        })
    }
}

module.exports = certificationModel;
