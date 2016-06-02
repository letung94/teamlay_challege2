var express = require('express');
var router = express.Router();
var di = require('../config/config');



var userid = 1;

router.get('/project/getAll', function (req,res, next) {
    var cv_id = 1;
    var cvService = di.resolve("curriculum_vitae");
    var cvInstance = new cvService();
    cvInstance.checkCVBelongToUser(cv_id, userid, function (code, data) {
        if (code == 1){
            if (data){
                var projectService = di.resolve('project');
                var projectInstance = new projectService();
                projectInstance.getAllProjectByCVId({CV_Id : cv_id}, function (code, rows) {
                   console.log(code);
                   if (code == 1){
                       res.json({code: code, rows: rows});
                       res.end();
                   } else if (code == -1){
                       next();
                   }
                });
            } else { //Not belong to user
                next();
            }
        } else if (code == -1){//Server problem
            next();
        } 
        
    }) 
});

router.post('/project/add', function (req, res) {
    var projectService = di.resolve('project');
    var projectInstance = new projectService();
	var idcv = req.baseUrl.split("/")[2];
	var entity = req.body.entity;
	entity.CV_Id = idcv;
	console.log(entity);
    projectInstance.createProject(entity, function (code, data) {
        console.log(data);
        res.json({code: code, data: data});
    });      
});

router.post('/project/update', function (req, res) {
    var projectService = di.resolve('project');
    var projectInstance = new projectService();
	var idcv = req.baseUrl.split("/")[2];
    console.log(req.body);
	var entity = req.body.entity;
	entity.CV_Id = idcv;
	console.log(entity);
    projectInstance.updateProject(entity, function (code, data) {
        console.log(data);
        res.json({code: code, data: data});
    });        
})

module.exports = router;