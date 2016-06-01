var certification = require('../model/certification');
// checkCVBelongToUser
function certificate_service(){
    this.getAllCertificationByCVId = function(param, cb){
        var c = new certification();
        c.getAllCertificationByCVId(param, cb);
    }

    this.saveCertification = function(param, cb){
        var c = new certification();
        c.saveCertification(param, cb);
    }

    this.deleteCertification = function(id, cb){
        var c = new certification();
        c.deleteCertification(id, cb);
    }
}

module.exports = certificate_service;
