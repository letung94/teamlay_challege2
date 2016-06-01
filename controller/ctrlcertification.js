var express = require('express');
var router = express.Router();
var di = require('../config/config');

module.exports = router;

var userid = 1;

router.get('/certification/getAll', function (req, res) {
	var cv_id = req.baseUrl.split("/")[2];
	var cvService = di.resolve('curriculum_vitae');
	var cvServiceIns = new cvService();
	cvServiceIns.checkCVBelongToUser(cv_id, userid, function(code, data){
		if(code == 1){
			if(data == true){ /*This cv_id belong to this user*/
				var cerService = di.resolve('certification');
				var cerServiceIns = new cerService();
				cerServiceIns.getAllCertificationByCVId(cv_id, function(cerCode, rows){
					return res.json({code: cerCode, rows: rows});
				})
			}else{/*This cv_id not belong to this user*/
				return res.json({code : cerCode, msg: 'The CV you send belong to other user.'} );
			}
		}else if (code == -1){ /*Somethong wrong with server*/
			console.log(data);
			return res.json({code: code});
		}
	})
});

router.post('/certification/add', function (req, res) {
	var cerService = di.resolve('certification');
	var cerServiceIns = new cerService();
	var idcv = req.baseUrl.split("/")[2];
	var entity = req.body.entity;
	entity.CV_Id = idcv;
	console.log(entity);
	cerServiceIns.saveCertification(entity, function(code, data){
		console.log(code);
		res.json({code: code, data: data});
	})
});

router.post('/certification/edit', function (req, res) {
	var cv_id = req.baseUrl.split("/")[2];
	var cvService = di.resolve('curriculum_vitae');
	var cvServiceIns = new cvService();
	cvServiceIns.checkCVBelongToUser(cv_id, userid, function(code, data){
		if(code == 1){
			if(data == true){ /*This cv_id belong to this user*/
				var cerService = di.resolve('certification');
				var cerServiceIns = new cerService();
				var entity = req.body.entity;
				console.log(entity);
				cerServiceIns.saveCertification(entity, function(cerCode, rows){
					return res.json({code: cerCode, rows: rows});
				})
			}else{/*This cv_id not belong to this user*/
				return res.json({code : cerCode, msg: 'The CV you want to edit belong to another user.'} );
			}
		}else if (code == -1){ /*Somethong wrong with server*/
			console.log(data);
			return res.json({code: code});
		}
	});
});

router.post('/certification/delete', function (req, res) {
	var cv_id = req.baseUrl.split("/")[2];
	var cvService = di.resolve('curriculum_vitae');
	var cvServiceIns = new cvService();
	cvServiceIns.checkCVBelongToUser(cv_id, userid, function(code, data){
		if(code == 1){
			if(data == true){ /*This cv_id belong to this user*/
				var cerService = di.resolve('certification');
				var cerServiceIns = new cerService();
				var certificationId = req.body.id;
				cerServiceIns.deleteCertification(certificationId, function(cerCode, rows){
					return res.json({code: cerCode, rows: rows});
				})
			}else{/*This cv_id not belong to this user*/
				return res.json({code : cerCode, msg: 'The CV you want to delete belong to another user.'} );
			}
		}else if (code == -1){ /*Somethong wrong with server*/
			console.log(data);
			return res.json({code: code});
		}
	});
});
