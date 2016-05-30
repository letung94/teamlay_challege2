var contactInfoModel = require('../model/contact_info');

function contact_info_service(){
    this.getByIdCV = function(param, cb){
        var c = new contactInfoModel();
        c.getByIdCV(param.CV_Id, cb);
    }
}

module.exports = contact_info_service;
