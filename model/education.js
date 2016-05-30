function educationModel() {
    // console.log('in');
    var Education = require('../config/config').resolve("db").Education;

    this.getAllEdutcationByCVId = function (param, callback) { // param: CV_Id,
        education = new Education();
        education.find('all',{where:'CV_Id=' + param.CV_Id},function(err,rows,fields){
            callback(rows);
        })
    }
}

module.exports = educationModel;
