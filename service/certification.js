var certification = require('../model/certification');
function certificate_service(){
    this.getAllCertificationByCVId = function(param, cb){
        var c = new certification();
        c.getAllCertificationByCVId(param, cb);
    }

    this.saveCertification = function(param, cb){
        var c = new certification(
            param.Title,
            param.CertificateAuthority,
            param.Date,
            param.Details,
            param.CV_Id
        );
        var valid = c.checkValidation();
        if(valid) {
            c.saveCertification(param, cb);
        } else {
            cb(0,'Human Error');
        }
    }

    this.deleteCertification = function(id, cb){
        var c = new certification();
        c.deleteCertification(id, cb);
    }
}

module.exports = certificate_service;
