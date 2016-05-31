<<<<<<< HEAD
function Summary(headLine, professionalsummary, cv_id, id) {
    var self = this;
    self.attribute = {
        "Headline" : headLine,
        "ProfessionalSummary" : professionalsummary,
        "CV_Id" : cv_id
    }
     
    var summary = require('../config/config').resolve("db").Summary;
    // the reqdata paramater is id of the CV
    // callback is a callback function data returned and status
    self.getByIdCV = function(reqdata, callback) {
        var temp = new summary();
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
            `Id` INT(11) NOT NULL,
            `Headline` VARCHAR(50) NULL DEFAULT NULL,
            `ProfessionalSummary` TEXT NULL DEFAULT NULL,
            `CV_Id` INT(11) NOT NULL,
        */ 
        var gettemp = new summary();
        var savetemp = new summary(reqdata);
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

module.exports = Summary;
=======
function summaryModel(){
    var Summary = require('../config/config').resolve("db").Summary;
    this.getAllSummaryByCVId = function (params, callback) {
        summary = new Summary();
        summary.find('all', {fields: ['Headline', 'ProfessionalSummary'], where: 'CV_id = ' + params.CV_Id}, function (err, rows, fields) {
           callback(rows); 
        });
    }
        
}

module.exports = summaryModel;
>>>>>>> 8971e05c961d5e46fd029a5d271b39c70cef4692
