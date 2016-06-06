var userModel = require('../model/user');

function admin_service(){
    this.getAllUser = function(callback){
        var u = new userModel();
        u.getAllUserWithNumOfCV(callback);
    }
    this.getUserRoleByUsername = function(username,callback){
        var u = new userModel();
        u.getUserRoleByUsername(username,callback);
    }
}

module.exports = admin_service;