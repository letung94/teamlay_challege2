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
        })
    }
}

module.exports = educationModel;
