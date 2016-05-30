//var contact_info = require('../config/config').resolve('contact_info');
var experience = require('../model/experience');
var express = require('express');
var router = express.Router();

router.post('/experience/save', function(req, res) {
    var idcv = req.baseUrl.split("/")[2];
    req.body.CV_Id = idcv;
    var experience_save = new experience(req.body.Company,
    req.body.Designation,
    req.body.FromDate,
    req.body.ToDate,
    req.body.Details,
    req.body.CV_Id);
    var valid = experience_save.checkValidation();
    if(valid){
        experience_save.save(experience_save.attribute, function(err,data){
        res.send({flag: err, resdata: data});   
    });
    }else{

        res.send({flag: 0, resdata: experience_save.attrvalidate});
    }
});
router.get('/experience/getall',function(req,res){
    var experience_getAllByIdCV = new experience();
    var idcv = req.baseUrl.split("/")[2];
    experience_getAllByIdCV.getAllByIdCV(idcv,function(err,rows){
        res.send({flag: err, resdata: rows});
    });
})
module.exports = router;
