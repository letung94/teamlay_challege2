var education = require('../model/education');
var di = require('../config/config');
var express = require('express');
var router = express.Router();
var cv_user = require('../middleware/checkcv_user').isBlong;

router.get('/education/getall', [cv_user], function(req, res) {
    var education_service = di.resolve('education');
    var education_service_ins = new education_service();
    var idcv = req.baseUrl.split("/")[2];
    education_service_ins.getAllByIdCV(idcv, function(err, rows) {
        res.send({
            flag: err,
            resdata: rows
        });
    });
})

router.post('/education/save', [cv_user], function(req, res) {
    var education_service = di.resolve('education');
    var education_service_ins = new education_service();
    var idcv = req.baseUrl.split("/")[2];
    req.body.CV_Id = idcv;
    education_service_ins.createEducation({
        Institude: req.body.Institute,
        Degree: req.body.Degree,
        FromDate: req.body.FromDate,
        ToDate: req.body.ToDate,
        Details: req.body.Details,
        CV_Id: req.body.CV_Id
    }, function(flag, resdata) {
        res.json({
            flag: flag,
            resdata: resdata
        });
    });
});

router.post('/education/update', [cv_user], function(req, res) {
    var education_service = di.resolve('education');
    var education_service_ins = new education_service();
    education_service_ins.updateEducation({
        Id: req.body.Id,
        Institude: req.body.Institute,
        Degree: req.body.Degree,
        FromDate: req.body.FromDate,
        ToDate: req.body.ToDate,
        Details: req.body.Details,
        CV_Id: req.body.CV_Id
    }, function(flag, resdata) {
        res.json({
            flag: flag,
            resdata: resdata
        });
    });
});
router.post('/education/delete', [cv_user], function(req, res) {
    var education_service = di.resolve('education');
    var education_service_ins = new education_service();
    education_service_ins.deleteEducation(req.body.Id, function(flag, resdata) {
        res.send({
            flag: flag,
            resdata: resdata
        });
    });
});

module.exports = router;