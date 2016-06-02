function ProjectModel() {
    var Project = require('../config/config').resolve('db').Project;
    this.getAllProjectByCVId = function (params, callback) {
        project = new Project();
        project.find('all', {fields: ['Id', 'Title', 'Url', 'Details', 'Date'], where: 'CV_Id = ' + params.CV_Id}, function (err, rows, fields) {
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
            Date: params.Date,
            Details: params.Details,
            CV_Id: params.CV_Id
        });
        project.save(function (err, result) {
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
        project = new Project();
        project.find('all', {where: "Id = " + params.Id}, function (err, rows, fields) {
            if (err){
                callback(-1, err);
            } else {
                if (rows.length == 0){
                    callback(0, null);
                } else {
                    project.set('Title', params.Title);
                    project.set('Details', params.Details);
                    project.set('Url', params.Url);
                    project.set('Date', params.Date);
                    project.save();
                    
                    callback(1, rows); 
                }
            }            
        });
    }
}

module.exports = ProjectModel;