// function experienceModel(){
//     var Experience = require('../config/config').resolve("db").Experience;
//     this.getAllExperienceByCVId = function (params, callback) {
//         experience = new Experience();
//         experience.find('all', {fields: ['Company', 'Designation', 'Details', 'FromDate', 'ToDate'], where: 'CV_id = ' + params.CV_Id}, function (err, rows, fields) {
//             rows.forEach(function (item) {
//                 item.FromDate = item.FromDate.toString().substring(4,15);
//                 item.ToDate = item.ToDate.toString().substring(4,15);
//             });
//            callback(rows); 
//         });
//     }
    
//     this.createExperience = function (params, callback) {        
//         //TODO: Validation
        
//         experience = new Experience({
//             Company: params.company,
//             Designation: params.designation,
//             FromDate: params.fromDate,
//             ToDate: params.toDate,
//             Details: params.details,
//             CV_Id: '1'          //Get current logged in user here (Passport)
//         });
        
//         experience.save(function(err, result){
//             if (err){
//                 console.log(err);
//             } else {
//                 callback(result);
//             }  
//         });
//     }
        
// }



function Experience(company,designation,fromdate,todate,details,cv_id) {
    var self = this;
    self.attribute = {
        "Company" : company,
        "Designation" : designation,
        "FromDate" : fromdate,
        "ToDate" : todate,
        "Details" : details,
        "CV_id" : cv_id
    }
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
            if(company !=null || company !== ""){
                    var length = company.length;
                    if(length >= this.min && length <= this.max ){
                        this.valid = true;
                    }
            }
            return this.valid;
        }, attrname: "Company"},
        {validate: null, attrname: "Designation"},
        {validate: function(fromdate){
            this.require = true;
            this.regex = /^([0-9]{2,4})\/([0-1][0-9])\/([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
            this.valid = false;
            if(fromdate !=null || fromdate !== ""){
                this.valid = this.regex.test(fromdate);
            }
            return this.valid;
        }, attrname: "FromDate"},
        {validate: function(todate){
            this.require = true;
            this.regex = /^([0-9]{2,4})\/([0-1][0-9])\/([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
            this.valid = false;
            if(todate !=null || todate !== ""){
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
        // spilt value of each attr into Name of table Contact_Info

    // return true if all attribute are valid if not false;
    self.checkValidation = function(){
        var valid = true;
        var attr_length = self.attrvalidate.length;
        for(var i = 0; i < attr_length; i++){
            if(this.attrvalidate[i].validate != null){
                if(this.attrvalidate[i].attrname === "Minusdate"){
                    var minusdate = Date.parse(self.attribute["ToDate"]) - Date.parse(self.attribute["FromDate"]) ;        
                    valid  &= self.attrvalidate[i].validate(minusdate);
                }else{
                    valid  &= self.attrvalidate[i].validate(self.attribute[self.attrvalidate[i].attrname]);
                }
            } 
        }
        return valid;
    }

    var experience = require('../config/config').resolve("db").Experience;
    // the reqdata paramater is id of the CV
    // callback is a callback function data returned and status
    self.getAllByIdCV = function(reqdata, callback) {
        var temp = new experience();
        temp.find('all', {where: "CV_Id = " + reqdata},function(err,rows,fields){
           if(err){
                callback(-1, err)
            }else{
                if(rows.length == 0){
                     callback(0, null);
                }else{
                    function parseDate(date){
                        var res = "";
                        var currentdate = new Date(date);
                        var digitalmonth=((currentdate.getMonth()+1)>=10) ? (currentdate.getMonth()+1) : '0' + (currentdate.getMonth()+1);  
                        var digitaldate=((currentdate.getDate())>=10)? (currentdate.getDate()) : '0' + (currentdate.getDate());
                        res = currentdate.getFullYear() + "/" + digitalmonth + "/" +  digitaldate;
                        return res;
                    }         
                    var rowslength = rows.length;
    
                    for(var i = 0; i < rowslength; i++){
                        rows[i].FromDate =  parseDate(rows[i].FromDate);
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
    self.save = function(reqdata, callback){
        var savetemp = new experience(reqdata);
        savetemp.save(function(err,data){
                    if(err){
                        callback(-1, err)
                    }else{
                        self.attribute.Id = data.insertId;
                        callback(1, self.attribute)
                    }
                });
    }
    
    self.update = function(reqdata, callback){
        var updatetemp = new experience(self.attribute);
        updatetemp.set("id",reqdata);
        updatetemp.save(function(err,data){
            if(err){
                        callback(-1, err)
                    }else{
                        self.attribute.Id = reqdata;
                        callback(1, self.attribute)
                    }
        });

    }
    
    self.remove = function(reqdata, callback){
        var removetemp = new experience(self.attribute);
        removetemp.set("id",reqdata);
        removetemp.remove(function(err,data){
            if(err){
                        callback(-1, err)
                    }else{
                        self.attribute.Id = reqdata;
                        callback(1, self.attribute)
                    }
        });

    }
}

module.exports = Experience;
