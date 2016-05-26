/*----------This is Nhieu's code----------*/
var express=require('express');
var bodyparser=require('body-parser');
var jsonparser=bodyparser.json();
var router=express.Router();
var di = require('../config/config');
var db = di.resolve('db');

router.get('/cv/:idcv',function(req,res){
    db.readCVById(req,function(flag,data){
        res.end(JSON.stringify(data));    
    });        
});

router.post('/cv/:idcv/contact-info/update',[jsonparser],function(req,res){
    db.updateContactInfo(req,function(flag,data){
        res.json(data);
        res.end();            
    });    
});

module.exports = router;

/*--------------------*/