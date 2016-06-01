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
        console.log('model');
        console.log(certification);
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

    this.deleteCertification = function(id, callback){
        console.log('asd: ' + id);
        certification = new Certification({id: id});
        certification.remove(function(err, rows){
            if (err) {
                callback(-1, err)
            } else {
                if (rows.length == 0) {
                    callback(0, null);
                } else {
                    callback(1, rows);
                }
            }
        });
    }

}

module.exports = certificationModel;
