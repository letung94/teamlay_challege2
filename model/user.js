function userModel() {
    var User = require('../config/config').resolve("db").User;
    this.addUser = function (user, callback) {
        var newUser = new User(user);
        newUser.save();
        callback();
    }
    this.updateUser = function (newUser,callback) {
        var user = new User(newUser);
        user.save();
        user.set('id', newUser.Id);
        user.save();
        callback();
    }
    this.getAllUser = function (callback) {
        user = new User();
        user.find('all', function (err, rows, fields) {
            callback(rows);
        });
    }
    this.getByUsername = function (username, callback) {
        user = new User();
        user.find('first', { where: "Username = '" + username + "'" }, function (err, row) {
            callback(err, row);
        });
    }
    this.getByEmail = function (email, callback) {
        user = new User();
        user.find('first', { where: "Email = '" + email + "'" }, function (err, row) {
            callback(row);
        });
    }
    this.getByToken = function (token, callback) {
        user = new User();
        user.find('first', { where: "Token = '" + token + "'" }, function (err, row) {
            callback(err, row);
        });
    }
    this.getAllUserList=function (params) {
        
    }
}

module.exports = userModel;