var userModel = require('../model/user');

function admin_service(){
    this.getAllUser = function(callback){
        var u = new userModel();
        u.getAllUserWithNumOfCV(callback);
    }
}

module.exports = admin_service;