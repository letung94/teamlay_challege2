var education = require('../model/education');
var express = require('express');
var router = express.Router();

router.get('/education/getall',function(req,res){
    var education_getAllByIdCV = new education();
    var idcv = req.baseUrl.split("/")[2];
    education_getAllByIdCV.getAllByIdCV(idcv,function(err,rows){
        res.send({flag: err, resdata: rows});
    });
})

module.exports = router;