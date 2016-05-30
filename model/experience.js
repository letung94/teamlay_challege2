function Experience(attribute) {
    var self = this;
    self.attribute = attribute

/**
 * `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Company` NVARCHAR(100) NULL DEFAULT NULL,
  `Designation` NVARCHAR(50) NULL DEFAULT NULL,
  `FromDate` DATETIME NULL DEFAULT NULL,
  `ToDate` DATETIME NULL DEFAULT NULL,
  `Details` TEXT NULL DEFAULT NULL,
  `CV_id` INT(11) NOT NULL,
 * 
 */
    self.attrvalidate = [
        {validate: function(company){
            this.valid = false;
            this.required = true;
            this.min = 2;
            this.max = 49;
            if(firstname !=null || firstname !== ""){
                    var length = firstname.length;
                    if(length >= this.min && length <= this.max ){
                        this.valid = true;
                    }
            }
            return this.valid;
        }, attrname: "Company"},
        {validate: null, attrname: "Designation"},
        {validate: function(fromdate){
            this.require = true;
            this.regex = '[0-9]{4}\-(?:0[1-9]|1[0-2])\-(?:0[1-9]|[1-2][0-9]|3[0-1])\s+(?:2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]';
            this.valid = fasle;
            if(fromdate !=null || fromdate !== ""){
                this.valid = this.regex.test(fromdate);
            }
            return this.valid;
        }, attrname: "FromDate"},
        {validate: function(todate){
            this.require = true;
            this.regex = '[0-9]{4}\-(?:0[1-9]|1[0-2])\-(?:0[1-9]|[1-2][0-9]|3[0-1])\s+(?:2[0-3]|[0-1][0-9]):[0-5][0-9]:[0-5][0-9]';
            this.valid = fasle;
            if(todate !=null || todate !== ""){
                this.valid = this.regex.test(todate);
            }
            return this.valid;
        }, attrname: "ToDate"},   
        {validate: function(fromdate, todate){
            
        }, attrname: 'FromToDate'},
        {validate: null,attrname: "Details"}];
        // spilt value of each attr into Name of table Contact_Info

    // return true if all attribute are valid if not false;
    self.checkValidation = function(){
        var valid = true;
        var attr_length = self.attrvalidate.length;
        for(var i = 0; i < attr_length; i++){
            if(this.attrvalidate[i].validate != null){
               valid  &= self.attrvalidate[i].validate(self.attribute[self.attrvalidate[i].attrname]);
            }
        }
        return valid;
    }

    var contact_info = require('../config/config').resolve("db").contact_info;
    // the reqdata paramater is id of the CV
    // callback is a callback function data returned and status
    self.getByIdCV = function(reqdata, callback) {
        var temp = new contact_info();
        temp.find('all', {where: "CV_Id = " + reqdata},function(err,rows,fields){
           if(err){
                callback(-1, err)
            }else{
                if(rows.length == 0){
                     callback(0, null);
                }else{
                    callback(1, rows[0]);
                }
            }
        });
        //var contact_info = require('../config/config').resolve("db").contact_info;
    }
    // the reqdata paramater is object
    // callback is a callback function data returned and status
    self.save = function(reqdata, callback){
        /*
        `Id` INT(11) NOT NULL AUTO_INCREMENT,
        `FirstName` VARCHAR(50) NULL DEFAULT NULL,
        `LastName` VARCHAR(50) NULL DEFAULT NULL,
        `Avatar` VARCHAR(255) NULL DEFAULT NULL,
        `Email` VARCHAR(50) NULL DEFAULT NULL,
        `Phone` VARCHAR(13) NULL DEFAULT NULL,
        `Website` VARCHAR(100) NULL DEFAULT NULL,
        `Address` VARCHAR(255) NULL DEFAULT NULL,
        `CV_Id` INT(11) NOT NULL,
        */
        var gettemp = new contact_info();
        var savetemp = new contact_info(reqdata);
        gettemp.find('all', {where: "CV_Id = " + reqdata.CV_Id},function(err,rows,fields){
            var id = null;
            if(rows.length > 0){
                id = rows[0].Id;
            }
            if(id != null){
                savetemp.set('id',id);
                savetemp.save(function(err,data){
                    if(err){
                        callback(-1, err)
                    }else{
                        self.attribute.Id = data.insertId;
                        callback(1, self.attribute)
                    }
                });
            }else{
                savetemp.save(function(err,data){
                    if(err){
                        callback(-1, err)
                    }else{
                        self.attribute.Id = data.insertId;
                        callback(1, self.attribute)
                    }
                });
            }

        });
    }
}

module.exports = Contact_Info;
