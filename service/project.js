var project = require('../model/project');

function project_service() {
    this.getAllProjectByCVId = function (params, callback) {
        var p = new project();
        p.getAllProjectByCVId(params, callback);
    }
    this.createProject = function (params, callback) {
        var p = new project();
        p.createProject(params, callback);
    }
    this.updateProject = function (params, callback) {
        var p = new Project();
        p.updateProject(params, callback);
    }
}

module.exports = project_service;