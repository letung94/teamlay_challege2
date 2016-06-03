var contactInfoModel = require('../model/contact_info');

function contact_info_service(){
    this.getByIdCV = function(param, cb){
        var c = new contactInfoModel();
        c.getByIdCV(param.CV_Id, cb);
    }
    this.save = function(param,callback){
        var contact_info_save = new contactInfoModel(param.FirstName,
        param.LastName,
        param.Avatar,
        param.Email,
        param.Phone,
        param.Website,
        param.Address,
        param.CV_Id);
        var valid = contact_info_save.checkValidation();
        if(valid){
            contact_info_save.save(contact_info_save.attribute, callback);
        }else{
            
            callback(0, contact_info_save.attrivalidate);
        }
    }
}

module.exports = contact_info_service;

