     /*
    // Summary Model
   */

        /*
        `Id` INT(11) NOT NULL,
        `Headline` VARCHAR(50) NULL DEFAULT NULL,
        `ProfessionalSummary` TEXT NULL DEFAULT NULL,
        `CV_Id` INT(11) NOT NULL,
        */ 
function Summary(headLine, professionalsummary, cv_id, id) {
    var self = this;
    self.attribute = {
        "Headline" : headLine,
        "ProfessionalSummary" : professionalsummary,
        "CV_Id" : cv_id
    }
     
    var summary = require('../config/config').resolve("db").Summary;
    
    /* Function Get Summary By ID of CV*/
    self.getByIdCV = function(reqdata, callback) {
        var temp = new summary();
        temp.find('first', {fields: ['Id', 'Headline', 'ProfessionalSummary', 'CV_Id'],where: "CV_Id = " + reqdata},function(err,row,fields){
           if(err){
                callback(-1, err)
            }else{
                if(row == null){
                    callback(0, null);
                }else{
                    callback(1, row);
                }
            }
        });
    }
    
    /* Function Save Summary By ID of CV*/
    self.save = function(reqdata, callback){
        var gettemp = new summary();
        var savetemp = new summary(reqdata);
        gettemp.find('first', {fields: ['Id'], where: "CV_Id = " + reqdata.CV_Id},function(err,row,fields){
            var id = null;
           if(row != null){
                id = row.Id;
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

module.exports = Summary;

