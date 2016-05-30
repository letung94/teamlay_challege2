function userModel() {
    var User = require('../config/config').resolve("db").User;
    this.addUser = function (user, callback) {
        var newUser = new User(user);
        newUser.save();
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
            callback(err, row);
        });
    }
}

module.exports = userModel;