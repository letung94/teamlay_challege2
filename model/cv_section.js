function CV_Section(cv_id,section_id,isdeleted, order, id) {
    var self = this;
    self.attribute = {
        "CV_Id" : cv_id,
        "Section_Id" : section_id,
        "IsDeleted" : isdeleted,
        "Order" : order,
    }

    self.attrvalidate = [];
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
    
    var cv_section = require('../config/config').resolve("db").CV_Section;
    
    
    self.createlistCV_Section_CV_Id = function(reqdata, callback){
        var list = [];
        for(var i = 1; i < 8; i++){
            var data = {CV_Id : reqdata,Section_Id : 0,IsDeleted : 0,Order : 0};
            data.Section_Id = i;
            data.Order = i;
            list.push(data);
        }
        var count = 0;
        var async = require('async');
        async.waterfall([
            function(callback1){
                 var tempcv_section = new cv_section(list[count]);
                 tempcv_section.save(function(err,row){
                     //tempcv_section.killConnection();
                     count++;
                     callback1(null,count);
                 })
                 
            },function(count, callback2){
                 var tempcv_section = new cv_section(list[count]);
                 tempcv_section.save(function(err,row){
                     //tempcv_section.killConnection();
                     count++;
                     callback2(null,count);
                 })
                 
            },function(count, callback3){
                 var tempcv_section = new cv_section(list[count]);
                 tempcv_section.save(function(err,row){
                     //tempcv_section.killConnection();
                     count++;
                     callback3(null,count);
                 })
                 
            },function(count, callback4){
                 var tempcv_section = new cv_section(list[count]);
                 tempcv_section.save(function(err,row){
                     //tempcv_section.killConnection();
                     count++;
                     callback4(null,count);
                 })
                 
            },function(count, callback5){
                 var tempcv_section = new cv_section(list[count]);
                 tempcv_section.save(function(err,row){
                     //tempcv_section.killConnection();
                     count++;
                     callback5(null,count);
                 })
                 
            },function(count, callback6){
                 var tempcv_section = new cv_section(list[count]);
                 tempcv_section.save(function(err,row){
                     //tempcv_section.killConnection();
                     count++;
                     callback6(null,count);
                 })
                 
            },function(count, callback7){
                 var tempcv_section = new cv_section(list[count]);
                 tempcv_section.save(function(err,row){
                     tempcv_section.killConnection();
                     count++;
                     callback7(null,count);
                 })
            }
        ],function(err,result){
            callback(err,result);
        })
    }
    
    self.getSectionByIdCV = function(reqdata,callback){
            var temp = new cv_section();
            //fields:['Id','CV_Id', 'Section_Id', 'IsDeleted', 'Order'],
            temp.find('all', {
                where: "CV_Id = " + reqdata + " && IsDeleted = 0"
            }, function(err, rows, fields) {
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
    /*
    // the reqdata paramater is object
    // callback is a callback function data returned and status
    */
    self.update = function(reqdata, callback){
        var updatetemp = new cv_section(self.attribute);
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
}

module.exports = CV_Section;