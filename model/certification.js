function certificationModel() {
    // console.log('in');
    var Certification = require('../config/config').resolve("db").Certification;

    this.getAllCertificationByCVId = function (param, callback) { // param: CV_Id,
        certification = new Certification();
        certification.find('all',{where:'CV_Id=' + param.CV_Id},function(err,rows,fields){
            callback(rows);
        })
    }

    this.saveCertification = function(param, callback){
        certification = new Certification(param);
        // certification.set('id', 6);
        certification.save(function(errors, results){
            if(errors){
                console.log(errors);
            }
            callback(errors, results);
        });
    }

    this.removeCertification = function(param, callback){
        certification = new Certification(param);
        // certification.set('id', 6);
        certification.remove(function(errors, results){
            if(errors){
                console.log(errors);
            }
            callback(results, errors);
        });
    }
}

module.exports = certificationModel;
