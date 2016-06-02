function userModel(firstname, lastname, username, email, password, createddate, token, isconfirmed, isblocked, expired, id) {
    var self = this;
    self.attribute = {
        "Firstname": firstname,
        "Lastname": lastname,
        "Username": username,
        "Email": email,
        "PasswordHash": password,
        "CreatedDate": createddate,
        "Token": token,
        "IsConfirmed": isconfirmed,
        "IsBlocked": isblocked,
        "ResetPasswordExpire": expired,
        "Id": id
    }

    self.attrvalidate = [
        {
            attrname: "Username",
            validate: function (username) {
                this.valid = false;
                this.required = true;
                this.min = 5;
                this.max = 50;
                if (username != null || username !== "" || username != undefined) {
                    var length = username.length;
                    if (length > this.min && length <= this.max) {
                        this.valid = true;
                    }
                }
                return this.valid;
            }
        },
        {
            attrname: "PasswordHash",
            validate: function (password) {
                this.valid = false;
                this.required = true;
                if (password != null || password !== "" || password != undefined) {
                    this.valid = true;
                }
                return this.valid;
            }
        },
        {
            attrname: "Firstname",
            validate: function (firstname) {
                this.valid = false;
                this.required = true;
                this.min = 1;
                this.max = 50;
                if (firstname != null || firstname !== "" || username != undefined) {
                    var length = firstname.length;
                    if (firstname > this.min && length <= this.max) {
                        this.valid = true;
                    }
                }
                return this.valid;
            }
        },
        {
            attrname: "Lastname",
            validate: function (lastname) {
                this.valid = false;
                this.required = true;
                this.min = 1;
                this.max = 50;
                if (lastname != null || lastname !== "" || lastname != undefined) {
                    var length = lastname.length;
                    if (length > this.min && length <= this.max) {
                        this.valid = true;
                    }
                }
                return this.valid;
            }
        },
        {
            attrname: "CreatedDate",
            validate: null
        },
        {
            attrname: "IsBlocked",
            validate: null
        },
        {
            attrname: "IsConfirmed",
            validate: null
        },
        {
            attrname: "Id",
            validate: function (id) {
                this.valid = false;
                this.require = true;
                if (!isNaN(id) || id == null) {
                    this.valid = true;
                }
                return this.valid;
            }
        },
        {
            attrname: "Email",
            validate: function (email) {
                this.valid = false;
                this.required = true;
                this.regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/;
                if (email != null || email !== "") {
                    this.valid = this.regex.test(email);
                }
                return this.valid;
            }
        }];

    self.checkValidation = function () {
        var valid = true;
        var attr_length = self.attrvalidate.length;
        for (var i = 0; i < attr_length; i++) {
            if (this.attrvalidate[i].validate != null) {
                valid &= self.attrvalidate[i].validate(self.attribute[self.attrvalidate[i].attrname]);
            }
        }
        return valid;
    }

    var User = require('../config/config').resolve("db").User;
    this.addUser = function (user, callback) {
        var newUser = new User(user);
        newUser.save(function (err, data) {
            if (err) {
                callback(-1, err);
            } else {
                self.attribute.Id = data.insertId;
                callback(1, self.attribute)
            }
        });
    }
    this.updateUser = function (newUser, callback) {
        var user = new User(newUser);
        user.save();
        user.set('id', newUser.Id);
        user.save(function (err, data) {
            if (err) {
                callback(-1, err);
            }
            callback(1, data);
        });
        callback();
    }
    this.getAllUser = function (callback) {
        user = new User();
        user.find('all', function (err, rows, fields) {
            if (err) {
                console.log(err);
                callback(-1, err)
            } else {
                if (rows == null) {
                    callback(0, null);
                } else {
                    callback(1, rows);
                }
            }
        });
    }
    this.getByUsername = function (username, callback) {
        user = new User();
        user.find('first', { where: "Username = '" + username + "'" }, function (err, row) {
            if (err) {
                console.log(err);
                callback(-1, err);
            } else {
                if (row == null) {
                    callback(0, null);
                } else {
                    callback(1, row);
                }
            }
        });
    }
    this.getByEmail = function (email, callback) {
        user = new User();
        user.find('first', { where: "Email = '" + email + "'" }, function (err, row) {
            if (err) {
                console.log(err);
                callback(-1, err)
            } else {
                if (row == null) {
                    callback(0, null);
                } else {
                    callback(1, row);
                }
            }
        });
    }
    this.getByToken = function (token, callback) {
        user = new User();
        user.find('first', { where: "Token = '" + token + "'" }, function (err, row) {
            if (err) {
                console.log(err);
                callback(-1, err)
            } else {
                if (row == null) {
                    callback(0, null);
                } else {
                    callback(1, row);
                }
            }
        });
    }
}

module.exports = userModel;