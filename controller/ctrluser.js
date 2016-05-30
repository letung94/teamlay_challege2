/*----------This is Nhieu's code----------*/

var express=require('express');
var bodyparser=require('body-parser');
var ejs = require('ejs');

var di = require('../config/config');



var app = express();
var jsonparser = bodyparser.json();
var router=express.Router();





router.post('/cv/:idcv/contact-info/update',jsonparser,function(req,res){
    var ct = req.body;
    res.end();
});

// router.get('/cv/:idcv',function(req,res){
//     db.readCVById(req,function(flag,data){
//         res.render('pages/cv_index');
//         res.json(data);    
//     });        
// });

// router.post('/cv/:idcv/contact-info/update',[jsonparser],function(req,res){
//     db.updateContactInfo(req,function(flag,data){
//         res.json(data);
//         res.end();            
//     });    
// });


module.exports = router;