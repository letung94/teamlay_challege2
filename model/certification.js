function certificationModel() {
    // console.log('in');
    var Certification = require('../config/config').resolve("db").Certification;

    this.getAllCertificationByCVId = function (cv_id, callback) { // param: CV_Id,
        certification = new Certification();
        certification.find('all',{where:'CV_Id=' + cv_id},function(err,rows,fields){
            if(err){
                callback(-1, err)
            }else{
                if(rows.length == 0){
                    callback(0, null);
                }else{
                    callback(1, rows);
                }
            }
        })
    }

    this.saveCertification = function(param, callback){
        certification = new Certification(param);
        // certification.set('id', 6);
        certification.save(function(errors, results){
            if(errors){
                callback(-1, errors)
            }else{
                if(results.length == 0){
                    callback(0, null);
                }else{
                    callback(1, results);
                }
            }
        });
    }

    this.removeCertification = function(param, callback){
        certification = new Certification(param);
        certification.remove(function(errors, results){
            if(errors){
                console.log(errors);
            }
            callback(results, errors);
        });
    }

}

module.exports = certificationModel;
