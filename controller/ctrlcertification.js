var express = require('express');
var router = express.Router();
var di = require('../config/config');

module.exports = router;

router.get('/certification/getAll', function (req, res) {
	var cv_id = req.baseUrl.split("/")[2];
	var userId = req.user.Id;
	var cvService = di.resolve('curriculum_vitae');
	var cvServiceIns = new cvService();
	cvServiceIns.checkCVBelongToUser(cv_id, userId, function(flag, data){
		if(flag == 1){
			if(data == true){ /*This cv_id belong to this user*/
				var cerService = di.resolve('certification');
				var cerServiceIns = new cerService();
				cerServiceIns.getAllCertificationByCVId(cv_id, function(cerFlag, rows){
					return res.json({flag: cerFlag, rows: rows});
				});
			}else{/*This cv_id not belong to this user*/
				return res.json({flag : flag, msg: 'The CV you send belong to other user.'} );
			}
		}else if (flag == -1){ /*Somethong wrong with server*/
			return res.json({flag: flag, msg:''});
		}
	})
});

router.post('/certification/add', function (req, res) {
	var idcv = req.baseUrl.split("/")[2];
	var entity = req.body.entity;
	var cerService = di.resolve('certification');
	var cerServiceIns = new cerService();

	entity.CV_Id = idcv;
	cerServiceIns.saveCertification(entity, function(flag, data){
		res.json({flag: flag, data: data});
	})
});

router.post('/certification/edit', function (req, res) {
	var cv_id = req.baseUrl.split("/")[2];
	var userId = req.user.Id;
	var cvService = di.resolve('curriculum_vitae');
	var cvServiceIns = new cvService();
	cvServiceIns.checkCVBelongToUser(cv_id, userId, function(flag, data){
		if(flag == 1){
			if(data == true){ /*This cv_id belong to this user*/
				var cerService = di.resolve('certification');
				var cerServiceIns = new cerService();
				var entity = req.body.entity;
				entity.CV_Id = cv_id;
				cerServiceIns.saveCertification(entity, function(cerFlag, rows){
					return res.json({flag: cerFlag, rows: rows});
				})
			}else{/*This cv_id not belong to this user*/
				return res.json({flag : cerFlag, msg: 'The CV you want to edit belong to another user.'} );
			}
		}else if (flag == -1){ /*Something wrong with server*/
			return res.json({flag: flag});
		}
	});
});

router.post('/certification/delete', function (req, res) {
	var cv_id = req.baseUrl.split("/")[2];
	var userId = req.user.Id;
	var cvService = di.resolve('curriculum_vitae');
	var cvServiceIns = new cvService();
	cvServiceIns.checkCVBelongToUser(cv_id, userId, function(flag, data){
		if(flag == 1){
			if(data == true){ /*This cv_id belong to this user*/
				var cerService = di.resolve('certification');
				var cerServiceIns = new cerService();
				var certificationId = req.body.id;
				cerServiceIns.deleteCertification(certificationId, function(cerFlag, rows){
					return res.json({flag: cerFlag, rows: rows});
				})
			}else{/*This cv_id not belong to this user*/
				return res.json({flag : cerFlag, msg: 'The CV you want to delete belong to another user.'} );
			}
		}else if (flag == -1){ /*Somethong wrong with server*/
			return res.json({flag: flag});
		}
	});
});
