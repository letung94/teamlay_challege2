var express = require('express');
var router = express.Router();
var di = require('../config/config');
var helper = require('../helper/helper');

router.get('/project/getAll', function (req,res, next) {
	var cv_id = req.baseUrl.split("/")[2];
	var userId = req.user.Id;    
    var projectService = di.resolve('project');
    var projectInstance = new projectService();
    projectInstance.getAllProjectByCVId({CV_Id : cv_id}, function (code, rows) {
         if (code == 1){
               res.json({code: code, rows: rows});
               res.end();
         } else if (code == -1){
               next();
         }
    });    

});

router.post('/project/add', function (req, res) {
    var projectService = di.resolve('project');
    var projectInstance = new projectService();
	var idcv = req.baseUrl.split("/")[2];
	var entity = req.body.entity;

	entity.CV_Id = idcv;    
    projectInstance.createProject(entity, function (code, data) {
        res.json({code: code, data: data});
    });      
});

router.post('/project/update', function (req, res) {
 	var cv_id = req.baseUrl.split("/")[2];
	var userId = req.user.Id;  
    var projectService = di.resolve('project');
    var projectInstance = new projectService();        
    var entity = req.body.entity;
    projectInstance.updateProject(entity, function (res_code, rows) {
        return res.json({code: res_code, rows: rows});
    });     
});

router.post('/project/delete', function (req, res) {
	var cv_id = req.baseUrl.split("/")[2];
	var userId = req.user.Id;
    var projectService = di.resolve('project');
    var projectInstance = new projectService();
    var projectId = req.body.id;
    projectInstance.deleteProject(projectId, function(res_code, rows){
        return res.json({code: res_code, rows: rows});
    });    

});


module.exports = router;