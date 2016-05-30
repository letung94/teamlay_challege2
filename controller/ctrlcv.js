var express=require('express');
var bodyparser=require('body-parser');
var ejs = require('ejs');

var di = require('../config/config');

var dbcv=di.resolve('cv');
var dbuser=di.resolve('user');
var app=express();
var jsonparser=bodyparser.json();
var router=express.Router();


router.post('/create',[jsonparser],function(req,res){
    dbcv.createCV(req,function(data){
        console.log(data);
        res.end();
    })        
});
router.get('/:idcv',function(req,res){
    dbcv.getCV(req,function(data){
        // var obj=JSON.parse(data);
        // data['Name']=({"teamId":"4","status":"pending"});
        // res.render('pages/cv_index');
        res.render('pages/cv_index',{data:data[0]});
        //res.json(data[0]);    
    });        
});

router.post('/:idcv/contact-info/update',[jsonparser],function(req,res){
    db.updateContactInfo(req,function(flag,data){
        res.json(data);
        res.end();            
    });    
});

module.exports = router;