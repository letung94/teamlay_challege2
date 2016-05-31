var curriculum_vitae_model = require('../model/cv');

function curriculum_vitae_service() {
    this.getAllCV = function (param, cb) {
        var c = new curriculum_vitae_model();
        c.getAllCV(param, cb);
    }

    this.getEnableCV = function (param, cb) {
        var c = new curriculum_vitae_model();
        c.getEnableCV(param, cb);
    }

    this.disableCV = function (param, cb) {
        var c = new curriculum_vitae_model();
        c.disableCV(param, cb);
    }

    this.getByIdCV = function (param, cb) {
        var c = new curriculum_vitae_model();
        c.getByIdCV(param.id, cb);
    }

    this.createCV = function (param, callback) {
        var dbcv_create = new curriculum_vitae_model(param.Name, null, 0, null, param.UserId, null);
        var valid = dbcv_create.checkValidation();
        if (valid) {
            dbcv_create.save(dbcv_create.attribute, callback);
        } else {
            callback(0,dbcv_save.attrvalidate);
        }
    }
    
    this.updateCV = function (param, callback) {
        var dbcv_save = new curriculum_vitae_model(param.Name, param.CreatedDate, param.IsDeleted, param.UrlSlug, param.UserId, param.Id);
        var valid = dbcv_save.checkValidation();
        if (valid) {
            dbcv_save.save(dbcv_save.attribute, callback);
        } else {
            callback(0,dbcv_save.attrvalidate);
        }
    }
}

module.exports = curriculum_vitae_service;
