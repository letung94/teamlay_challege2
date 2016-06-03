var education = require('../model/education');
var express = require('express');
var router = express.Router();

router.get('/education/getall', function(req, res) {
    var education_getAllByIdCV = new education();
    var idcv = req.baseUrl.split("/")[2];
    education_getAllByIdCV.getAllByIdCV(idcv, function(err, rows) {
        res.send({
            flag: err,
            resdata: rows
        });
    });
})

router.post('/education/save', function(req, res) {
    var idcv = req.baseUrl.split("/")[2];
    req.body.CV_Id = idcv;
    var education_save = new education(req.body.Institute,
        req.body.Degree,
        req.body.FromDate,
        req.body.ToDate,
        req.body.Details,
        req.body.CV_Id);
    var valid = education_save.checkValidation();
    if (valid) {
        education_save.save(education_save.attribute, function(err, data) {
            res.send({
                flag: err,
                resdata: data
            });
        });
    } else {
        res.send({
            flag: 0,
            resdata: education_save.attrvalidate
        });
    }
});


module.exports = router;