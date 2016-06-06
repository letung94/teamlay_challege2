function Experience(company, designation, fromdate, todate, details, cv_id) {
    var self = this;
    self.attribute = {
        "Company" : company,
        "Designation" : designation,
        "FromDate" : fromdate,
        "ToDate" : todate,
        "Details" : details,
        "CV_Id" : cv_id
    }

    self.attrvalidate = [
        {validate: function(company){
            this.valid = false;
            this.required = true;
            this.min = 2;
            this.max = 100;
            if(company !=null || company !== ""){
                    var length = company.length;
                    if(length >= this.min && length <= this.max ){
                        this.valid = true;
                    }
            }
            return this.valid;
        },
        attrname: "Company"
    }, {
        validate: function(designation) {
        this.valid = false;
        this.max = 100;
        if(designation !=null || designation !== ""){
                    var length = designation.length;
                    if(length <= this.max ){
                        this.valid = true;
                    }
            }
            return this.valid;           
    },
        attrname: "Designation"
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
        }, attrname: "ToDate"},   
        {validate: function(minusdate){
           this.valid = false;
           if(minusdate > 0){
               this.valid = true;
           }
           return this.valid;
        }, attrname: 'Minusdate'},
        {validate: null,attrname: "Details"}];

    self.checkValidation = function(){
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

    var experience = require('../config/config').resolve("db").Experience;
    self.getAllExperienceByCVId = function(reqdata, callback) {
            var temp = new experience();
            temp.find('all', {
                where: "CV_Id = " + reqdata, order: "ToDate",
            }, function(err, rows, fields) {
                temp.killConnection();
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
            //var contact_info = require('../config/config').resolve("db").contact_info;
        }
        // the reqdata paramater is object
        // callback is a callback function data returned and status
    self.saveExperience = function(reqdata, callback) {
        var savetemp = new experience(reqdata);
        savetemp.save(function(err, data) {
            savetemp.killConnection();
            if (err) {
                callback(-1, err)
            } else {
                self.attribute.Id = data.insertId;
                callback(1, self.attribute)
            }
        });
    }
    
    self.updateExperience = function(reqdata, callback){
        var updatetemp = new experience(self.attribute);
        updatetemp.set("id", reqdata);
        updatetemp.save(function(err, data) {
            updatetemp.killConnection();
            if (err) {
                callback(-1, err)
            } else {
                self.attribute.Id = reqdata;
                callback(1, self.attribute)
            }
        });

    }

    self.deleteExperience = function(reqdata, callback) {
        var removetemp = new experience(self.attribute);
        removetemp.set("id", reqdata);
        removetemp.remove(function(err, data) {
            removetemp.killConnection();
            if (err) {
                callback(-1, err)
            } else {
                self.attribute.Id = reqdata;
                callback(1, self.attribute)
            }
        });

    }
}

module.exports = Experience;