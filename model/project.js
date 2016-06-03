function ProjectModel() {

    var Project = require('../config/config').resolve('db').Project;
    this.getAllProjectByCVId = function (params, callback) {
        project = new Project();
        project.find('all', {fields: ['Id', 'Title', 'Url', 'Details', 'FromDate', 'ToDate'], where: 'CV_Id = ' + params.CV_Id}, function (err, rows, fields) {            
        //project.find('all', {fields: ['Id', 'Title', 'Url', 'Details', 'Date'], where: 'CV_Id = ' + params.CV_Id}, function (err, rows, fields) {
            project.killConnection();          
            console.log(err);
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
            //Date: params.Date,
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
            console.log(err);
            console.log(result);
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
        console.log(`params : ${params}`);
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