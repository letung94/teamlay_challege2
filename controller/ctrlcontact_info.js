var contact_info_service = require('../config/config').resolve('contact_info');
var express = require('express');
var router = express.Router();

router.post('/contact_info/save', function(req, res) {
    var idcv = req.baseUrl.split("/")[2];
    req.body.CV_Id = idcv;
    var contact_info_save = new contact_info_service()
    contact_info_save.save({
        "FirstName" : req.body.FirstName,
        "LastName" : req.body.LastName,
        "Avatar" : req.body.Avatar,
        "Email" : req.body.Email,
        "Phone" : req.body.Phone,
        "Website" : req.body.Website,
        "Address" : req.body.Address,
        "CV_Id" : req.body.CV_Id}, function(err,data){
        res.send({flag: err, resdata: data});
    });
    
});
router.get('/contact_info/get/:idcontact_info?',function(req,res){
    var contact_info_getByIdCV = new contact_info_service();
    var idcv = req.baseUrl.split("/")[2];
    contact_info_getByIdCV.getByIdCV({"CV_Id" :idcv},function(err,rows){
        res.send({flag: err, resdata: rows});
    });
})
module.exports = router;
