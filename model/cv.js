function CVModel() {
    var Cv = require('../config/config').resolve("db").CV;
    this.createCV=function(req,callback){
        cv=new Cv({
            Name    :   req.body.name,
            UserId  :   req.body.userid
        });
        var id=cv.save();
        cv.query('SELECT LAST_INSERT_ID()',function(err,rows,fields){
            callback(rows);    
        });
    }
    this.getAllCV = function (req,callback) {
        cv = new Cv();
        cv.find('all', function (err, rows, fields) {
            callback(rows);
        });
    }
    this.getCV=function(req,callback){
        cv=new Cv();
        console.log(req.params.idcv);
        cv.find('all',{where:'Id='+req.params.idcv},function(err,rows,fields){
            callback(rows);    
        })
    }
}

module.exports = CVModel;