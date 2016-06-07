     /*
    //Summary Controller
   */
/*Declare variable for summary controller */
var summary_service = require('../config/config').resolve('summary');
var express = require('express');
var router = express.Router();
var cv_user = require('../middleware/checkcv_user').isBlong;

/*URL post for save summary */
router.post('/summary/save', cv_user, function(req, res) {
    var idcv = req.baseUrl.split("/")[2];
    req.body.CV_Id = idcv;
    var summary_save = new summary_service()
    summary_save.save({
        "Headline" : req.body.Headline,
        "ProfessionalSummary" : req.body.ProfessionalSummary,
        "CV_Id" : req.body.CV_Id}, function(err,data){
        res.send({flag: err, resdata: data});
    });
});

/*URL get for get summary */
router.get('/summary/get/:idsummary?', cv_user, function(req,res){
    var summary_getByIdCV = new summary_service();
    var idcv = req.baseUrl.split("/")[2];
    summary_getByIdCV.getByIdCV({"CV_Id" :idcv},function(err,rows){
        res.send({flag: err, resdata: rows});
    });
})

module.exports = router;
