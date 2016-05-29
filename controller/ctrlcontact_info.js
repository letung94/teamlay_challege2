//var contact_info = require('../config/config').resolve('contact_info');
var contact_info = require('../model/contact_info');
var express = require('express');
var router = express.Router();

router.post('/contact_info/save', function(req, res) {
    //
    var contact_info_save = new contact_info(
    req.body.FirstName,
    req.body.LastName,
    req.body.Avatar,
    req.body.Email,
    req.body.Phone,
    req.body.Website,
    req.body.Address,
    req.body.CV_Id);
    var valid = contact_info_save.checkValidation();
    if(valid){
        contact_info_save.save(function(err,data){
        res.send({flag: err, resdata: data});
    });
    }else{

        res.send({flag: 0, resdata: contact_info_save.attrvalidate});
    }
});
router.get('/contact_info/get',function(req,res){
    res.send('alert("Hello");');
})
module.exports = router;
