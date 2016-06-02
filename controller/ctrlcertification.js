var express = require('express');
var router = express.Router();
var Certification = require('../model/Certification');
var di = require('../config/config');

module.exports = router;

router.get('/certification/getAll', function (req, res) {
	var cv_id = req.baseUrl.split("/")[2];
	var userId = req.user.Id;
	var cvService = di.resolve('curriculum_vitae');
	var cvServiceIns = new cvService();
	cvServiceIns.checkCVBelongToUser(cv_id, userId, function(code, data){
		if(code == 1){
			if(data == true){ /*This cv_id belong to this user*/
				var cerService = di.resolve('certification');
				var cerServiceIns = new cerService();
				cerServiceIns.getAllCertificationByCVId(cv_id, function(cerCode, rows){
					return res.json({code: cerCode, rows: rows});
				});
			}else{/*This cv_id not belong to this user*/
				return res.json({code : code, msg: 'The CV you send belong to other user.'} );
			}
		}else if (code == -1){ /*Somethong wrong with server*/
			return res.json({code: code, msg:''});
		}
	})
});

router.post('/certification/add', function (req, res) {
	var idcv = req.baseUrl.split("/")[2];
	var entity = req.body.entity;
	var certification = new Certification(
		entity.Title,
		entity.CertificateAuthority,
		entity.Date,
		entity.Details,
		idcv
	);
	var valid = certification.checkValidation();
	if(valid)
	{
		var cerService = di.resolve('certification');
		var cerServiceIns = new cerService();

		entity.CV_Id = idcv;
		cerServiceIns.saveCertification(entity, function(code, data){
			res.json({code: code, data: data});
		})
	}else{
		res.json({code: 0});
	}
});

router.post('/certification/edit', function (req, res) {
	var cv_id = req.baseUrl.split("/")[2];
	var userId = req.user.Id;
	var cvService = di.resolve('curriculum_vitae');
	var cvServiceIns = new cvService();
	cvServiceIns.checkCVBelongToUser(cv_id, userId, function(code, data){
		if(code == 1){
			if(data == true){ /*This cv_id belong to this user*/
				var cerService = di.resolve('certification');
				var cerServiceIns = new cerService();
				var entity = req.body.entity;
				cerServiceIns.saveCertification(entity, function(cerCode, rows){
					return res.json({code: cerCode, rows: rows});
				})
			}else{/*This cv_id not belong to this user*/
				return res.json({code : code, msg: 'The CV you want to edit belong to another user.'} );
			}
		}else if (code == -1){ /*Something wrong with server*/
			return res.json({code: code});
		}
	});
});

router.post('/certification/delete', function (req, res) {
	var cv_id = req.baseUrl.split("/")[2];
	var userId = req.user.Id;
	var cvService = di.resolve('curriculum_vitae');
	var cvServiceIns = new cvService();
	cvServiceIns.checkCVBelongToUser(cv_id, userId, function(code, data){
		if(code == 1){
			if(data == true){ /*This cv_id belong to this user*/
				var cerService = di.resolve('certification');
				var cerServiceIns = new cerService();
				var certificationId = req.body.id;
				cerServiceIns.deleteCertification(certificationId, function(cerCode, rows){
					return res.json({code: cerCode, rows: rows});
				})
			}else{/*This cv_id not belong to this user*/
				return res.json({code : code, msg: 'The CV you want to delete belong to another user.'} );
			}
		}else if (code == -1){ /*Somethong wrong with server*/
			return res.json({code: code});
		}
	});
});
