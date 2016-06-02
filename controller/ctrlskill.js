//var contact_info = require('../config/config').resolve('contact_info');
var skill = require('../model/skill');
var express = require('express');
var router = express.Router();

router.post('/skill/save', function(req, res) {
    var idcv = req.baseUrl.split("/")[2];
    req.body.CV_Id = idcv;
    var skill_save = new skill(req.body.Name,
    req.body.Expertise,
    req.body.Experience,
    req.body.LastYearUsed,
    req.body.CV_Id);
    var valid = skill_save.checkValidation();
    if(valid){
        skill_save.save(skill_save.attribute, function(err,data){
        res.send({flag: err, resdata: data});   
    });
    }else{

        res.send({flag: 0, resdata: skill_save.attrvalidate});
    }
});
router.get('/skill/getall',function(req,res){
    var skill_getAllByIdCV = new skill();
    var idcv = req.baseUrl.split("/")[2];
    skill_getAllByIdCV.getAllByIdCV(idcv,function(err,rows){
        res.send({flag: err, resdata: rows});
    });
})
router.post('/skill/update', function(req, res) {
    var skill_update = new skill(req.body.Name,
    req.body.Expertise,
    req.body.Experience,
    req.body.LastYearUsed,
    req.body.CV_Id);
    var valid = skill_update.checkValidation();
    if(valid){
        skill_update.update(req.body.Id, function(err,data){
        res.send({flag: err, resdata: data});   
    });
    }else{

        res.send({flag: 0, resdata: skill_update.attrvalidate});
    }
});
router.post('/skill/delete', function(req, res) {
    var skill_delete = new skill();
        skill_delete.remove(req.body.Id, function(err,data){
        res.send({flag: err, resdata: data});   
    });
});
module.exports = router;
