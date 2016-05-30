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
        var newid=data[0].newid;
        res.redirect(newid);
    })        
});

router.post('/:idcv/update',[jsonparser],function(req,res){
    dbcv.updateCV(req,function(data){
        res.json(data);
    })        
});

router.get('/:idcv',function(req,res){
    dbcv.getCV(req,function(data){

        if(data.length > 0){
            res.render('pages/cv_index',{data:data[0]});
        }else{
            res.render('pages/not_found_404');
        }
        
    });        
});

router.get('/',function(req,res){
    dbcv.getAllCV(req,function(data){
        res.json(data);    
    });
})

module.exports = router;