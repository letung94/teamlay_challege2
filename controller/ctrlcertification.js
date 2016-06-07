var express = require('express');
var router = express.Router();
var di = require('../config/config');

module.exports = router;

router.get('/certification/getAll', function (req, res) {
	var cv_id = req.baseUrl.split("/")[2];
	var userId = req.user.Id;
	var cerService = di.resolve('certification');
	var cerServiceIns = new cerService();
	cerServiceIns.getAllCertificationByCVId(cv_id, function(cerFlag, rows){
		return res.json({flag: cerFlag, rows: rows});
	});
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
	var cerService = di.resolve('certification');
	var cerServiceIns = new cerService();
	var entity = req.body.entity;
	entity.CV_Id = cv_id;
	cerServiceIns.saveCertification(entity, function(cerFlag, rows){
		return res.json({flag: cerFlag, rows: rows});
	})
});

router.post('/certification/delete', function (req, res) {
	var cv_id = req.baseUrl.split("/")[2];
	var userId = req.user.Id;
	var cerService = di.resolve('certification');
	var cerServiceIns = new cerService();
	var certificationId = req.body.id;
	cerServiceIns.deleteCertification(certificationId, function(cerFlag, rows){
		return res.json({flag: cerFlag, rows: rows});
	})
});
