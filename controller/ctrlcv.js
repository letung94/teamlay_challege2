var express=require('express');
var bodyparser=require('body-parser');
var ejs = require('ejs');

var di = require('../config/config');

var dbcv=di.resolve('cv');
var dbuser=di.resolve('user');
var app=express();
var jsonparser=bodyparser.json();
var router=express.Router();


router.get('/:idcv',function(req,res){
    dbcv.getAllCV(function(data){
        // res.render('pages/cv_index');
        res.json(data);    
    });        
});

router.post('/:idcv/contact-info/update',[jsonparser],function(req,res){
    db.updateContactInfo(req,function(flag,data){
        res.json(data);
        res.end();            
    });    
});

module.exports = router;