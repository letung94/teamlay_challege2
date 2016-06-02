function Experience(company,designation,fromdate,todate,details,cv_id) {
    var self = this;
    self.attribute = {
        "Institude" : institude,
        "Degree" : degree,
        "FromDate" : fromdate,
        "ToDate" : todate,
        "Details" : details,
        "CV_Id" : cv_id
    }

   self.attrvalidate = [
        {validate: function(institude){
            this.valid = false;
            this.required = true;
            this.max = 99;
            if(institude !=null || institude !== ""){
                    var length = institude.length;
                    if(length >= this.min && length <= this.max ){
                        this.valid = true;
                    }
            }
            return this.valid;
        }, attrname: "Institude"},
        {validate: function(degree){
            this.valid = false;
            this.max = 99;
            if(degree !=null || degree !== ""){
                    var length = degree.length;
                    if(length <= this.max ){
                        this.valid = true;
                    }
            }
            return this.valid;
        }, attrname: "Degree"},
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
}

function educationModel() {
    // console.log('in');
    var Education = require('../config/config').resolve("db").Education;

    this.getAllEducationByCVId = function (param, callback) { // param: CV_Id,
        education = new Education();
        education.find('all',{where:'CV_Id=' + param.CV_Id},function(err,rows,fields){
            if(err){
                callback(-1, err);
            }else{
                callback(1, rows);
            }
        });
    }
}

module.exports = educationModel;
