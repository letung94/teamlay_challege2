var helper = require('../helper/helper');

function ProjectModel(Title, Url, FromDate, ToDate, Details, CV_Id) {
    var self = this;
    self.attribute = {
        "Title" : Title,
        "Url" : Url,
        "FromDate" : FromDate,
        "ToDate" : ToDate,
        "CV_Id" : CV_Id
    }
    self.attrvalidate = [
        {validate: function(project){
            this.valid = false;
            this.required = true;
            this.min = 2;
            this.max = 100;
            if(project !=null || project !== ""){
                    var length = project.length;
                    if(length >= this.min && length <= this.max ){
                        this.valid = true;
                    }
            }
            return this.valid;
        }, attrname: "Title"},
        {validate: function(details){
            this.valid = false;
            this.required = true;
            this.min = 1;
            if(details !=null || details !== ""){
                this.valid = true;
            }
            return this.valid;
        }, attrname: "Details"},        
        {validate: function(url){
            this.valid = false;
            if (url.length == 0){
                return true;
            }
            this.min = 2;
            this.max = 100;        
            var url_regex = new RegExp('^(https?:\\/\\/)?'+ // protocol
                '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
                '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
                '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
                '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
                '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
            if(url_regex.test(url) && url.length >= this.min && url.length <= this.max){
                this.valid = true;
            }
            return this.valid;
        }, attrname: "Url"},
        {
            validate: function(fromdate) {
                this.require = true;
                this.regex = /^([0-9]{2,4})\/([0-1][0-9])\/([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
                this.valid = false;
                if (fromdate != null || fromdate !== "") {
                    this.valid = this.regex.test(fromdate);
                }
                return this.valid;
            },
            attrname: "FromDate"
            }, {
            validate: function(todate) {
                this.require = true;
                this.regex = /^([0-9]{2,4})\/([0-1][0-9])\/([0-3][0-9])(?:( [0-2][0-9]):([0-5][0-9]):([0-5][0-9]))?$/;
                this.valid = false;
                if (todate != null || todate !== "") {
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
                    }, attrname: 'Minusdate'}];
     /*
    // return true if all attribute are valid if not false;
    */
    self.checkValidation = function(){
        var valid = true;
        var attr_length = self.attrvalidate.length;
        for(var i = 0; i < attr_length; i++){
            if (this.attrvalidate[i].attrname === 'Minusdate'){
                    var minusdate = Date.parse(self.attribute["ToDate"]) - Date.parse(self.attribute["FromDate"]);
                    valid &= self.attrvalidate[i].validate(minusdate);                
            } else {
                if(this.attrvalidate[i].validate != null){
                    valid  &= self.attrvalidate[i].validate(self.attribute[self.attrvalidate[i].attrname]);
                } 
            }
        }
        return valid;
    }



    var Project = require('../config/config').resolve('db').Project;
    this.getAllProjectByCVId = function (params, callback) {
        project = new Project();
        project.find('all', {fields: ['Id', 'Title', 'Url', 'Details', 'FromDate', 'ToDate'], where: 'CV_Id = ' + params.CV_Id, order:['ToDate'], orderDESC:true}, function (err, rows, fields) {                   
            project.killConnection();          
            if (err){
                callback(-1, err);
            } else {
                if (rows.length == 0){
                    callback(0, null);
                } else {
                    callback(1, rows); 
                }
            }
           
        });
    }
    
    this.createProject = function (params, callback) {        
        project = new Project({
            Title: params.Title,
            Url: params.Url,
            FromDate: params.FromDate,
            ToDate: params.ToDate,
            Details: params.Details,
            CV_Id: params.CV_Id
        });
        project.save(function (err, result) {
            project.killConnection();
            if (err){
                callback(-1, err);
            } else {
                if (result.length == 0){
                    callback(0, null);
                } else {
                    callback(1, result);
                }
                
            }
        });
    }
    
    this.updateProject = function (params, callback) {
        project = new Project(params);
        project.save(function (err, result) {
            project.killConnection();
            if(err){
                callback(-1, err)
            }else{
                if(result.length == 0){
                    callback(0, null);
                }else{
                    callback(1, result);
                }
            }            
        });
    }
    
    this.deleteProject = function (params, callback) {
        project = new Project({id: params});
        project.remove(function (err, rows) {
            project.killConnection();
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

module.exports = ProjectModel;