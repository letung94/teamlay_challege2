function CV(name, createddate, isdeleted, urlslug, userid, id) {
    var self = this;
    self.attribute = {
        "Name": name,
        "CreatedDate": createddate,
        "IsDeleted": isdeleted,
        "UrlSlug": urlslug,
        "UserId": userid,
        "Id": id
    }

    self.attrvalidate = [
        {
            validate: function (name) {
                this.valid = false;
                this.required = true;
                this.min = 1;
                this.max = 50;
                if (name != null || name !== "") {
                    var length = name.length;
                    if (length >= this.min && length <= this.max) {
                        this.valid = true;
                    }
                }
                return this.valid;
            }, attrname: "Name"
        },
        {
            validate: null, attrname: "CreatedDate"
        },
        {
            validate: function (isdeleted) {
                this.valid = false;
                this.required = true;
                if (!isNaN(isdeleted)) {
                    if (isdeleted == 0 || isdeleted == 1) {
                        this.valid = true;
                    }
                }
                return this.valid;
            }, attrname: "IsDeleted"
        },
        {
            validate: null, attrname: "UrlSlug"
        },
        {
            validate: function (userid) {
                this.valid = false;
                this.require = true;
                if (!isNaN(isdeleted)) {
                    this.valid = true;
                }
                return this.valid;
            }, attrname: "UserId"
        },
        {
            validate: function (id) {
                this.valid = false;
                this.require = true;
                if (!isNaN(id) || id == null) {
                    this.valid = true;
                }
                return this.valid;
            }, attrname: "Id"
        }];
    // spilt value of each attr into Name of table Contact_Info

    // return true if all attribute are valid if not false;
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

    var Cv = require('../config/config').resolve("db").CV;
    // the reqdata paramater is id of the CV
    // callback is a callback function data returned and status
    self.getByIdCV = function (reqdata, callback) {
        var temp = new Cv();
        temp.find('all', { where: "Id = " + reqdata }, function (err, rows, fields) {
            if (err) {
                callback(-1, err)
            } else {
                if (rows.length == 0) {
                    callback(0, null);
                } else {
                    callback(1, rows[0]);
                }
            }
        });
    }

    self.getAllCV = function (param, callback) { // param:
        var temp = new Cv();
        temp.find('all', function (err, rows, fields) {
            if (err) {
                callback(-1, err)
            } else {
                if (rows.length == 0) {
                    callback(0, null);
                } else {
                    callback(1, rows);
                }
            }
        });
    }

    self.getEnableCV = function (param, callback) { // param:
        var temp = new Cv();
        temp.find('all', { where: "IsDeleted = 0" }, function (err, rows, fields) {
            if (err) {
                callback(-1, err)
            } else {
                if (rows.length == 0) {
                    callback(0, null);
                } else {
                    callback(1, rows);
                }
            }
        });
    }

    self.disableCV = function (param, callback) { // param:
        var newVal = {
            id: param.id,
            IsDeleted: 1
        }
        var cv = new Cv(newVal);
        cv.save(function (err, data) {
            if (err) {
                callback(-1, err);
            } else {
                callback(1, data);
            }
        });
    }

    self.save = function (reqdata, callback) {
        /*
        `Id` INT(11) NOT NULL AUTO_INCREMENT,
        `Name` NVARCHAR(500) NULL DEFAULT NULL,
        `CreatedDate` DATETIME NULL DEFAULT NULL,
        `IsDeleted` BIT(1) NULL DEFAULT NULL,
        `UrlSlug` NVARCHAR(600) NULL DEFAULT NULL,
        `UserId` INT(11) NULL DEFAULT NULL
        */
        var gettemp = new Cv();
        var savetemp = new Cv(reqdata);
        var idtemp = null;
        idtemp = reqdata.Id;
        if (idtemp != null) {
            gettemp.find('all', { where: "Id = " + idtemp }, function (err, rows, fields) {
                if (!err) {
                    if (rows.length > 0) {
                        savetemp.set('id', id);
                        savetemp.set('Id', null);
                    } else {
                        idtemp = null;
                        savetemp.set('Id', -1);
                    }
                } else {
                    callback(-1, err);
                }
            });
        }
        savetemp.save(function (err, data) {
            if (err) {
                callback(-1, err);
            } else {
                if (idtemp == null) {
                    self.attribute.Id = data.insertId;
                }
                callback(1, self.attribute);
            }
        });
    }

    self.checkCVBelongToUser = function (cv_id, userid, callback) {
        var query = "SELECT EXISTS(SELECT 1 FROM curriculum_vitae WHERE id = " + cv_id + " AND userid = " + userid + ") as Exist";
        var cv = new Cv();
        cv.query(query, function (err, rows, fields) {
            if (err) {
                callback(-1, err);
            } else {
                callback(1, rows);
            }
        });
    }
}

module.exports = CV;
