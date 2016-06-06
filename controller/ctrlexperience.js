//var contact_info = require('../config/config').resolve('contact_info');
var expService = require('../config/config').resolve('experience');
var express = require('express');
var router = express.Router();

router.get('/experience/getall', function(req, res) {
    var cv_id = req.baseUrl.split("/")[2];
    var expServiceGetAll = new expService();
    expServiceGetAll.getAllExperienceByCVId(cv_id, function(err, rows) {
        res.send({
            flag: err,
            resdata: rows
        });
    });
});

router.post('/experience/save', function(req, res) {
    var cv_id = req.baseUrl.split("/")[2];
    req.body.CV_Id = cv_id;
    var expServiceSave = new expService();
    expServiceSave.saveExperience({
       "Company" : req.body.Company,
       "Designation" :req.body.Designation,
       "FromDate" :req.body.FromDate,
       "ToDate" :req.body.ToDate,
       "Details" :req.body.Details,
       "CV_Id" :req.body.CV_Id}, function (err,data){
           res.send({
               flag: err,
               resdata: data
           });
    });  
});

router.post('/experience/update', function(req, res) {
    var cv_id = req.baseUrl.split("/")[2];
    req.body.CV_Id = cv_id; 
    var expServiceUpdate = new expService();
    expServiceUpdate.updateExperience({
        "Id": req.body.Id,
        "Company" : req.body.Company,
        "Designation" :req.body.Designation,
        "FromDate" :req.body.FromDate,
        "ToDate" :req.body.ToDate,
        "Details" :req.body.Details,
        "CV_Id" :req.body.CV_Id}, function (err,data){
            res.send({
                flag: err,
                resdata: data
            }); 
    });
});

router.post('/experience/delete', function(req, res) {
    var cv_id = req.baseUrl.split("/")[2];
    var expServiceDelete = new expService();
    expServiceDelete.deleteExperience(req.body.Id, function (err,data){
            res.send({
                flag: err,
                resdata: data
            }); 
    });
});
module.exports = router;