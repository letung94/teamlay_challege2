function Education(institude, degree, fromdate, todate, details, cv_id) {
    var self = this;
    self.attribute = {
        "Institude": institude,
        "Degree": degree,
        "FromDate": fromdate,
        "ToDate": todate,
        "Details": details,
        "CV_Id": cv_id
    }

    self.attrvalidate = [{
        validate: function(institude) {
            this.valid = false;
            this.required = true;
            this.min = 1;
            this.max = 99;
            if (institude != null || institude !== "" && typeof(institude)) {
                var length = institude.length;
                if (length >= this.min && length <= this.max) {
                    this.valid = true;
                }
            }
            return this.valid;
        },
        attrname: "Institude"
    }, {
        validate: function(degree) {
            this.valid = false;
            this.max = 99;
            if (degree != null || degree !== "") {
                var length = degree.length;
                if (length <= this.max) {
                    this.valid = true;
                }
            }
            return this.valid;
        },
        attrname: "Degree"
    }, {
        validate: function(fromdate) {
            this.require = true;
            this.regex = /^([0-9]{2,4})\/([0-1][0-9])\/([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
            this.valid = false;
            if (fromdate != null || fromdate !== "") {
                this.valid = this.regex.test(fromdate);
            }
            return this.valid;
        },
        attrname: "FromDate"
    }, {
        validate: function(todate) {
            this.require = true;
            this.regex = /^([0-9]{2,4})\/([0-1][0-9])\/([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
            this.valid = false;
            if (todate != null || todate !== "") {
                this.valid = this.regex.test(todate);
            }
            return this.valid;
        },
        attrname: "ToDate"
    }, {
        validate: function(minusdate) {
            this.valid = false;
            if (minusdate > 0) {
                this.valid = true;
            }
            return this.valid;
        },
        attrname: 'Minusdate'
    }, {
        validate: null,
        attrname: "Details"
    }];

    self.checkValidation = function() {
        var valid = true;
        var attr_length = self.attrvalidate.length;
        for (var i = 0; i < attr_length; i++) {
            if (this.attrvalidate[i].validate != null) {
                if (this.attrvalidate[i].attrname === "Minusdate") {
                    var minusdate = Date.parse(self.attribute["ToDate"]) - Date.parse(self.attribute["FromDate"]);
                    valid &= self.attrvalidate[i].validate(minusdate);
                } else {
                    valid &= self.attrvalidate[i].validate(self.attribute[self.attrvalidate[i].attrname]);
                }
            }
        }
        return valid;
    }
    var config = require('../config/config');
    var education = config.resolve("db").Education;

    self.getAllByIdCV = function(reqdata, callback) {
        var temp = new education();
        temp.find('all', {
            where: "CV_Id = " + reqdata
        }, function(err, rows, fields) {
            if (err) {
                callback(-1, err)
            } else {
                if (rows.length == 0) {
                    callback(0, null);
                } else {
                    function parseDate(date) {
                        var res = "";
                        var currentdate = new Date(date);
                        var digitalmonth = ((currentdate.getMonth() + 1) >= 10) ? (currentdate.getMonth() + 1) : '0' + (currentdate.getMonth() + 1);
                        var digitaldate = ((currentdate.getDate()) >= 10) ? (currentdate.getDate()) : '0' + (currentdate.getDate());
                        res = currentdate.getFullYear() + "/" + digitalmonth + "/" + digitaldate;
                        return res;
                    }
                    var rowslength = rows.length;

                    for (var i = 0; i < rowslength; i++) {
                        rows[i].FromDate = parseDate(rows[i].FromDate);
                        rows[i].ToDate = parseDate(rows[i].ToDate);
                    }

                    callback(1, rows);
                }
            }
        });
    }

    self.save = function(reqdata, callback) {
        var savetemp = new education(reqdata);
        savetemp.save(function(err, data) {
            if (err) {
                callback(-1, err)
            } else {
                self.attribute.Id = data.insertId;
                callback(1, self.attribute)
            }
        });
    }
}

module.exports = Education;