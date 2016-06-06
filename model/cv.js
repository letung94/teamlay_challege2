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

    self.attrvalidate = [{
        validate: function(name) {
            this.valid = false;
            this.required = true;
            this.min = 1;
            this.max = 49;
            try {
                if (name != null && name !== "" && typeof(name) != "undefined") {
                    var length = name.length;
                    if (length >= this.min && length <= this.max) {
                        this.valid = true;
                    }
                }
                return this.valid;
            } catch (err) {
                return false;
            }
        },
        attrname: "Name"
    }, {
        validate: null,
        attrname: "CreatedDate"
    }, {
        validate: null,
        attrname: "IsDeleted"
    }, {
        validate: null,
        attrname: "UrlSlug"
    }, {
        validate: function(userid) {
            this.valid = false;
            this.require = true;
            if (!isNaN(isdeleted)) {
                this.valid = true;
            }
            return this.valid;
        },
        attrname: "UserId"
    }, {
        validate: function(id) {
            this.valid = false;
            this.require = true;
            if (!isNaN(id) || id == null) {
                this.valid = true;
            }
            return this.valid;
        },
        attrname: "Id"
    }];
    // spilt value of each attr into Name of table Contact_Info

    // return true if all attribute are valid if not false;
    self.checkValidation = function() {
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
    
    var async = require('async');
    
    self.getByIdCV = function(reqdata, callback) {
        var temp = new Cv();
        /* the old code
            temp.find('all', {
                where: "Id = " + reqdata + " && IsDeleted = 0"
            }, function(err, rows, fields) {
                temp.killConnection();
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
        */
        /*LE TUNG CODE GET LIST OF ORDER CV_SECTION */
        temp.query("SELECT* FROM curriculum_vitae INNER JOIN cv_section On curriculum_vitae.Id = cv_section.CV_Id Where curriculum_vitae.Id = " + reqdata + " && curriculum_vitae.IsDeleted = 0",
        function(err,rows, fields){
            temp.killConnection();
            if (err) {
                callback(-1, err)
            } else {
                if (rows.length == 0) {
                    callback(0, null);
                } else {
                    var data = {
                        CreatedDate : rows[0].CreatedDate,
                        Id:rows[0].Id,
                        IsDeleted:rows[0].IsDeleted,
                        UrlSlug:rows[0].UrlSlug,
                        UserId:rows[0].UserId,
                        Name: rows[0].Name
                    };
                    callback(1, {cvdata: data, cv_section : rows});
                }
            }
        });
        /*................... */
    }
    
    self.getAllCV = function(param, callback) { // param:
        var temp = new Cv();
        temp.find('all', function(err, rows, fields) {
            temp.killConnection();
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

    self.getEnableCV = function(param, callback) { // param:
        var temp = new Cv();
        try {
            temp.find('all', {
                where: "IsDeleted = 0 && UserId = " + param.Id
            }, function(err, rows, fields) {
                temp.killConnection();
                if (err) {
                    callback(-1, err);
                } else {
                    if (rows.length == 0) {
                        callback(0, null);
                    } else {
                        callback(1, rows);
                    }
                }
            });
        } catch (err) {
            callback(-1, err);
        }
    }

    self.disableCV = function(param, callback) { // param:
        var newVal = {
            id: param.id,
            IsDeleted: 1
        }
        var cv = new Cv(newVal);
        cv.save(function(err, data) {
            cv.killConnection();
            if (err) {
                callback(-1, err);
            } else {
                callback(1, data);
            }
        });
    }

    self.save = function(reqdata, callback) {
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
            gettemp.find('all', {
                where: "Id = " + idtemp
            }, function(err, rows, fields) {
                gettemp.killConnection();
                if (!err) {
                    if (rows.length > 0) {
                        savetemp.set('id', id);
                    } else {
                        idtemp = null;
                        savetemp.set('Id', -1);
                    }
                } else {
                    callback(-1, err);
                }
            });
        }
        if (idtemp == null) {
            savetemp.save(function(err, data) {
                savetemp.killConnection();
                if (err) {
                    callback(-1, err);
                } else {
                    self.attribute.Id = data.insertId;
                    callback(1, self.attribute);
                }
            });
        } else {
            var updatequery = "UPDATE curriculum_vitae SET Name=\'" + reqdata.Name + "\',UrlSlug=\'" + reqdata.UrlSlug + "\' WHERE Id=" + idtemp;
            savetemp.query(updatequery, function(err, rows, fields) {
                savetemp.killConnection();
                if (err) {
                    callback(-1, err);
                } else {
                    callback(1, self.attribute);
                }
            });
        }
    }

    self.checkCVBelongToUser = function(cv_id, userid, callback) {
        var query = "SELECT EXISTS(SELECT 1 FROM curriculum_vitae WHERE Id = " + cv_id + " AND UserId = " + userid + ") as Exist";
        var cv = new Cv();
        cv.query(query, function(err, rows, fields) {
            if (err) {
                callback(-1, err);
            } else {
                if (rows.length == 0) {
                    callback(0, null);
                } else {
                    callback(1, rows);
                }
            }
            cv.killConnection();
        });
    }
}

module.exports = CV;