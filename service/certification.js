var certification = require('../model/certification');

function certificate_service(){
    this.getAllCertificationByCVId = function(param, cb){
        var c = new certification();
        c.getAllCertificationByCVId(param, cb);
    }
}

module.exports = certificate_service;
