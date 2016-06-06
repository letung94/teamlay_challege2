var project = require('../model/project');

function project_service() {
    this.getAllProjectByCVId = function (params, callback) {
        var p = new project();
        p.getAllProjectByCVId(params, callback);
    }
    this.createProject = function (params, callback) {
        var p = new project(
            params.Title,
            params.Url,
            params.FromDate,
            params.ToDate,
            params.Details,
            params.CV_Id
        );
        if(p.checkValidation()){
            p.createProject(params, callback);
        } else {
            callback(0, 'Validation Error');
        }
        
    }
    this.updateProject = function (params, callback) {
        var p = new project();
        p.updateProject(params, callback);
    }
    
    this.deleteProject = function (params, callback) {
        var p = new project();
        p.deleteProject(params, callback);        
    }
}

module.exports = project_service;