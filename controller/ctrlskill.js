var skill_service = require('../config/config').resolve('skill');
var express = require('express');
var router = express.Router();
var cv_user = require('../middleware/checkcv_user').isBlong;
router.post('/skill/save', cv_user,function(req, res) {
    var cv_id = req.baseUrl.split("/")[2];
    req.body.CV_Id = cv_id;
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
router.get('/skill/getall',cv_user,function(req,res){
    var skill_getAllByIdCV = new skill_service();
    var cv_id = req.baseUrl.split("/")[2];
    skill_getAllByIdCV.getAllSkillByCVId(cv_id,function(err,rows){
        res.send({flag: err, resdata: rows});
    });
})
router.post('/skill/update', function(req, res) {
    var cv_id = req.baseUrl.split("/")[2];
    req.body.CV_Id = cv_id;
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