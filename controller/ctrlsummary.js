     /*
    //Summary Controller
   */
  
var summary = require('../model/summary');
var express = require('express');
var router = express.Router();

/*URL post for save summary */
router.post('/summary/save', function(req, res) {
    var idcv = req.baseUrl.split("/")[2];
    req.body.CV_Id = idcv;
    var summary_save = new summary(req.body.Headline,
    req.body.ProfessionalSummary,
    req.body.CV_Id);
    summary_save.save(summary_save.attribute, function(err,data){
    res.send({flag: err, resdata: data});   
    });
});

/*URL get for get summary */
router.get('/summary/get/:idsummary?',function(req,res){
    var summary_getByIdCV = new summary();
    var idcv = req.baseUrl.split("/")[2];
    summary_getByIdCV.getByIdCV(idcv,function(err,rows){
        res.send({flag: err, resdata: rows});
    });
})

module.exports = router;
