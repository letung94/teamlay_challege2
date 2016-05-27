/*----------This is Nhieu's code----------*/

var express=require('express');
var bodyparser=require('body-parser');
var ejs = require('ejs');
<<<<<<< HEAD
=======

var di = require('../config/config');
>>>>>>> 5d2fdac69797233ab4246531ee65348757e276f7


var app = express();
var jsonparser = bodyparser.json();
var router=express.Router();




<<<<<<< HEAD
router.post('/cv/:idcv/contact-info/update',jsonparser,function(req,res){
    var ct = req.body;
    res.end();
});
=======
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
>>>>>>> 5d2fdac69797233ab4246531ee65348757e276f7

module.exports = router;