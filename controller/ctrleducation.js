var education = require('../model/education');
var di = require('../config/config');
var express = require('express');
var router = express.Router();

router.get('/education/getall', function(req, res) {
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

router.post('/education/save', function(req, res) {
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

router.post('/education/update', function(req, res) {
    var education_update = new education(req.body.Institute,
        req.body.Degree,
        req.body.FromDate,
        req.body.ToDate,
        req.body.Details,
        req.body.CV_Id);
    var valid = education_update.checkValidation();
    if (valid) {
        education_update.update(req.body.Id, function(err, data) {
            res.send({
                flag: err,
                resdata: data
            });
        });
    } else {

        res.send({
            flag: 0,
            resdata: education_update.attrvalidate
        });
    }
});
router.post('/education/delete', function(req, res) {
    var update_delete = new education();
    update_delete.remove(req.body.Id, function(err, data) {
        res.send({
            flag: err,
            resdata: data
        });
    });
});

module.exports = router;