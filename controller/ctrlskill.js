var skill_service = require('../config/config').resolve('skill');
var express = require('express');
var router = express.Router();

router.post('/skill/save', function(req, res) {
    var idcv = req.baseUrl.split("/")[2];
    req.body.CV_Id = idcv;
    var skill_save = new skill_service();
    skill_save.save({
     "Name":   req.body.Name,
    "Expertise" : req.body.Expertise,
    "Experience" : req.body.Experience,
    "LastYearUsed":req.body.LastYearUsed,
    "CV_Id" : req.body.CV_Id}, function(err,data){
        res.send({flag: err, resdata: data});
    });
});
router.get('/skill/getall',function(req,res){
    var skill_getAllByIdCV = new skill_service();
    var idcv = req.baseUrl.split("/")[2];
    skill_getAllByIdCV.getAllSkillByCVId(idcv,function(err,rows){
        res.send({flag: err, resdata: rows});
    });
})
router.post('/skill/update', function(req, res) {
    var idcv = req.baseUrl.split("/")[2];
    req.body.CV_Id = idcv;
    var skill_update = new skill_service();
    skill_update.update({
        "Id":req.body.Id,
        "Name":   req.body.Name,
        "Expertise" : req.body.Expertise,
        "Experience" : req.body.Experience,
        "LastYearUsed":req.body.LastYearUsed,
        "CV_Id" : req.body.CV_Id}, function(err,data){
            res.send({flag: err, resdata: data});
    });
    
});
router.post('/skill/delete', function(req, res) {
    var skill_delete = new skill_service();
    skill_delete.delete(req.body.Id,function(err,data){
        res.send({flag: err, resdata: data});  
    });
});
module.exports = router;
