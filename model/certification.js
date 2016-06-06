function certificationModel(title, certificateAuthority, date, details, CV_Id) {
    var self = this;
    self.attribute = {
        "Title" : title,
        "CertificateAuthority" : certificateAuthority,
        "Date" : date,
        "Details" : details,
        "CV_Id" : CV_Id
    };

    self.attrvalidate = [
        {
            attrname: 'Title',
            validate: function(title){
                var valid = true;
                var max = 100;
                if(!title || title == ''){
                    valid = false;
                }
                if(title.length > 100){
                    valid = false;
                }
                return valid;
            }
        },
        {
            attrname: 'Date',
            validate: function(date){
                /*Validate smaller than today*/
                if(!date | date == ''){
                    return false;
                }
                var today = new Date();
                var inputDate = new Date(date);
                return inputDate <= today;
            }
        },
        {
            attrname: 'CV_Id',
            validate: function(CV_Id){
                /*CV_Id is require and Larger than 0 */
                var valid = true;
                if(!CV_Id || CV_Id <= 0){
                    valid = false;
                }
                return valid;
            }
        },
    ];

    self.checkValidation = function(){
        var valid = true;
        var attr_length = self.attrvalidate.length;
        for (var i = 0; i < attr_length; i++) {
            if (self.attrvalidate[i].validate != null) {
                valid &= self.attrvalidate[i].validate(self.attribute[self.attrvalidate[i].attrname]);
            }
        }
        return valid;
    }

    self.Certification = require('../config/config').resolve("db").Certification;
    self.getAllCertificationByCVId = function (cv_id, callback) { // param: CV_Id,
        var certification = new self.Certification();
        certification.find('all',{fields: ['Id', 'Title', 'CertificateAuthority', 'Date', 'Details', 'CV_Id'], where:'CV_Id=' + cv_id},function(err,rows,fields){
            certification.killConnection();
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

    self.saveCertification = function(param, callback){
        certification = new self.Certification(param);
        certification.save(function(errors, results){
            certification.killConnection();
            if(errors){
                callback(-1, errors)
            }else{
                if(results.length == 0){
                    callback(0, null);
                }else{
                    callback(1, results);
                }
            }
        });
    }

    self.deleteCertification = function(id, callback){
        certification = new self.Certification({id: id});
        certification.remove(function(err, rows){
            certification.killConnection();
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
}

module.exports = certificationModel;
