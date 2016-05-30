var express = require('express');
var bodyparser = require('body-parser');
var ejs = require('ejs');

var di = require('../config/config');

var app = express();
var jsonparser = bodyparser.json();
var router = express.Router();



router.get('/login', function(req, res) {
    res.render('pages/login');
});



/*router.post('/cv/:idcv/contact-info/update',jsonparser,function(req,res){
=======
router.post('/cv/:idcv/contact-info/update', jsonparser, function(req, res) {
>>>>>>> 012f4252e4a6f12de655237292fd409ae2cf0457
    var ct = req.body;
    res.end();
});

router.post('/cv/:idcv/contact-info/update', jsonparser, function(req, res) {
    var ct = req.body;
    res.end();
});*/

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