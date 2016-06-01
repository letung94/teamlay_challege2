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
				cerServiceIns.getAllCertificationByCVId(cv_id, function(code, rows){
					console.log('inside: ' + code + rows);
					if(code == 1){
						return res.json({code: code, rows: rows});
					}else if (code == -1){
						// return error page.
					}
				})
			}else{/*This cv_id not belong to this user*/
				// redirect
			}
		}else if (code == -1){ /*Somethong wrong with server*/
			// redirect
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
		// if(code == 1){
		// 	res.json({code: code, data: data});
		// }else{
		// 	res.json({IsSuccess: false });
		// }
	})
	// res.json({IsSuccess: true});
});
