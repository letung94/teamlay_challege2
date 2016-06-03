var express = require('express');
var router = express.Router();
var di = require('../config/config');
var helper = require('../helper/helper');



var userid = 1;

router.get('/project/getAll', function (req,res, next) {
	var cv_id = req.baseUrl.split("/")[2];
	var userId = req.user.Id;    
    var cvService = di.resolve("curriculum_vitae");
    var cvInstance = new cvService();
    cvInstance.checkCVBelongToUser(cv_id, userId, function (code, data) {
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
    if (!helper.isPastOrCurrentDate(entity.FromDate)){
        //Date is in future handle
        console.log("Date must be in the past");
        res.json({code: 0, data: "Date must be in the past"});
    }
    if (!helper.isPastOrCurrentDate(entity.ToDate)){
        //Date is in future handle
        console.log("Date must be in the past");
        res.json({code: 0, data: "Date must be in the past"});
    }    
	entity.CV_Id = idcv;
	console.log(entity);
    projectInstance.createProject(entity, function (code, data) {
        console.log(data);
        res.json({code: code, data: data});
    });      
});

router.post('/project/update', function (req, res) {
    var cvService = di.resolve("curriculum_vitae");
    var cvInstance = new cvService();
 	var cv_id = req.baseUrl.split("/")[2];
	var userId = req.user.Id;   
    console.log(req.body.entity);
    cvInstance.checkCVBelongToUser(cv_id, userId, function (code, data) {
       if (code == 1){
           if (data == true){
                var projectService = di.resolve('project');
                var projectInstance = new projectService();        
                var entity = req.body.entity;
                projectInstance.updateProject(entity, function (res_code, rows) {
                    return res.json({code: res_code, rows: rows});
                });
           } else {
               return res.json({code : code, msg: 'The CV you want to edit belong to another user.'} );
           }
       } else if (code == -1){
           return res.json({code: code});
       }
    });
    
    
    
	// var idcv = req.baseUrl.split("/")[2];
    // console.log(req.body);
	// var entity = req.body.entity;
	// entity.CV_Id = idcv;
	// console.log(entity);
    // projectInstance.updateProject(entity, function (code, data) {
    //     console.log(data);
    //     res.json({code: code, data: data});
    // });        
});

router.post('/project/delete', function (req, res) {
	var cv_id = req.baseUrl.split("/")[2];
	var userId = req.user.Id;
	var cvService = di.resolve('curriculum_vitae');
	var cvServiceIns = new cvService();
	cvServiceIns.checkCVBelongToUser(cv_id, userId, function(code, data){
		if(code == 1){
			if(data == true){ /*This cv_id belong to this user*/
				var projectService = di.resolve('project');
				var projectInstance = new projectService();
				var projectId = req.body.id;
				projectInstance.deleteProject(projectId, function(res_code, rows){
					return res.json({code: res_code, rows: rows});
				})
			}else{/*This cv_id not belong to this user*/
				return res.json({code : code, msg: 'The CV you want to delete belong to another user.'} );
			}
		}else if (code == -1){ /*Somethong wrong with server*/
			console.log(data);
			return res.json({code: code});
		}
	});
});


module.exports = router;