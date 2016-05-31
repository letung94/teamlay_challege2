var curriculum_vitae_model = require('../model/cv');

function curriculum_vitae_service(){
    this.getAllCV = function(param, cb){
        var c = new curriculum_vitae_model();
        c.getAllCV(param, cb);
    }

    this.getEnableCV = function(param, cb){
        var c = new curriculum_vitae_model();
        c.getEnableCV(param, cb);
    }

    this.disableCV = function(param, cb){
        var c = new curriculum_vitae_model();
        c.disableCV(param, cb);
    }

    this.getByIdCV = function(param, cb){
        var c = new curriculum_vitae_model();
        c.getByIdCV(param.id, cb);
    }
}

module.exports = curriculum_vitae_service;
