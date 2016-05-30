var certification = require('../model/certification');

function certificate_service(){
    this.getAllCertificationByCVId = function(param, cb){
        var c = new certification();
        c.getAllCertificationByCVId(param, cb);
    }

    this.saveCertification = function(param, cb){
        var c = new certification();
        c.saveCertification(param, cb);
    }

    this.removeCertification = function(param, cb){
        var c = new certification();
        c.removeCertification(param, cb);
    }
}

module.exports = certificate_service;
