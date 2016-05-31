var express = require('express');
var router = express.Router();
var di = require('../config/config');

module.exports = router;

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
