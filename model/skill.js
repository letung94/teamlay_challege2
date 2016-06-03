function Skill(name,expertise,experience,lastyearused,cv_id) {
    var self = this;
    self.attribute = {
        "Name" : name,
        "Expertise" : expertise,
        "Experience" : experience,
        "LastYearUsed" : lastyearused,
        "CV_Id" : cv_id
    }
    /*
  `Id` INT(11) NOT NULL AUTO_INCREMENT,
  `Name` NVARCHAR(50) NOT NULL ,
  `Expertise` TINYINT(1) NOT NULL ,
  `Experience` NVARCHAR(50) NOT NULL ,
  `LastYearUsed` INT(4) NOT NULL,
  `CV_Id` INT(11) NOT NULL,
    */
    self.attrvalidate = [
        {validate: function(company){
            this.valid = false;
            this.required = true;
            this.min = 2;
            this.max = 50;
            if(company !=null || company !== ""){
                    var length = company.length;
                    if(length >= this.min && length <= this.max ){
                        this.valid = true;
                    }
            }
            return this.valid;
        }, attrname: "Name"},
        {validate: function(expertise){
            this.valid = false;
            this.required = true;
            this.min = 1;
            this.max = 5;
            var experience_Int = parseInt(expertise);
            if(experience_Int >= this.min && experience_Int <= this.max){
                this.valid = true;
            }
            return this.valid;
        }, attrname: "Expertise"},
        {validate: function(experience){
            //doso
            this.valid = false;
            this.required = true;
            if(experience != null && experience != undefined){
                this.valid = true;
            }
            return this.valid;
        }, attrname: "Experience"},
        {validate: function(lastyearused){
            this.require = true;
            this.valid = false;
            this.currentyear = (new Date()).getFullYear();
            this.bottomyear = 1989;
            var lastyearused_Int = parseInt(lastyearused);
            if(lastyearused_Int > this.bottomyear  && lastyearused_Int <= this.currentyear){
                this.valid = true;
            }
            return this.valid;
        }, attrname: "LastYearUsed"}];
     /*
    // return true if all attribute are valid if not false;
    */
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

    var skill = require('../config/config').resolve("db").Skill;
    /*
    // the reqdata paramater is id of the CV
    // callback is a callback function data returned and status
    */
    self.getAllByIdCV = function(reqdata, callback) {
        var temp = new skill();
        temp.find('all', {fields:['Id','Name','Expertise','Experience','LastYearUsed','CV_Id'],where: "CV_Id = " + reqdata},function(err,rows,fields){
           temp.killConnection();
           if(err){
                callback(-1, err)
            }else{
                if(rows.length == 0){
                     callback(0, null);
                }else{
                    callback(1, rows);
                }
            }
        });
    }
    /*
    // the reqdata paramater is object
    // callback is a callback function data returned and status
    */
    self.save = function(reqdata, callback){
        var savetemp = new skill(reqdata);
        savetemp.save(function(err,data){
            savetemp.killConnection();
            if(err){
                callback(-1, err)
            }else{
                self.attribute.Id = data.insertId;
                callback(1, self.attribute)
            }
        });
    }
    
    self.update = function(reqdata, callback){
        var updatetemp = new skill(self.attribute);
        updatetemp.set("id",reqdata);
        updatetemp.save(function(err,data){
            updatetemp.killConnection();
            if(err){
                callback(-1, err)
            }else{
                self.attribute.Id = reqdata;
                callback(1, self.attribute)
            }
        });
    }
    
    self.remove = function(reqdata, callback){
        var removetemp = new skill(self.attribute);
        removetemp.set("id",reqdata);
        removetemp.remove(function(err,data){
            removetemp.killConnection();
            if(err){
                        callback(-1, err)
                    }else{
                        self.attribute.Id = reqdata;
                        callback(1, self.attribute)
                    }
        });

    }
}

module.exports = Skill;
