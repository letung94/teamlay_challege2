var cv_section_service = require('../config/config').resolve('cv_section');
var express = require('express');
var router = express.Router();

router.post('/cv_section/save', function(req, res) {
    var idcv = req.baseUrl.split("/")[2];
    
});
router.get('/cv_section/getall',function(req,res){
    var cv_section_getAllByIdCV = new cv_section_service();
    var cv_id = req.baseUrl.split("/")[2];
    cv_section_getAllByIdCV.getAllByCVId(cv_id,function(err,rows){
        res.send({flag: err, resdata: rows});
    });
})
router.post('/cv_section/update', function(req, res) {
    var cv_section_update = new cv_section_service();
    cv_section_update.changeOrder(req.body.data1,req.body.data2,function(data1,data2){
        res.send({data1,data2});
    });
});
router.post('/cv_section/delete', function(req, res) {
    var skill_delete = new skill_service();
    skill_delete.delete(req.body.Id,function(err,data){
        res.send({flag: err, resdata: data});  
    });
});
module.exports = router;
