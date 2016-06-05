//var contact_info = require('../config/config').resolve('contact_info');
var di = require('../config/config');
var express = require('express');
var router = express.Router();

// router.get('/experience/getall', function(req, res) {
//     var experience_getAllByIdCV = new experience();
//     var idcv = req.baseUrl.split("/")[2];
//     experience_getAllByIdCV.getAllByIdCV(idcv, function(err, rows) {
//         res.send({
//             flag: err,
//             resdata: rows
//         });
//     });
// })

router.get('/experience/getall', function(req, res) {
    var idcv = req.baseUrl.split("/")[2];
    var userId = req.user.Id;
    var cvService = di.resolve('curriculum_vitae');
    var cvServiceIns = new cvService();
    cvServiceIns.checkCVBelongToUser(idcv,userId, function(flag, data){
        if(flag == 1){
            if(data == true){
                var expService = di.resolve('experience');
                var expServiceIns = new expService();
                expServiceIns.getAllExperienceByCVId(idcv, function(err, rows) {
                    res.send({
                        flag: err,
                        resdata: rows
                    });
                });
            }else{
                res.send({
                    flag: err,
                    msg: 'The CV you send belong to other user.'
                });
            }
        }else if (flag == -1){
            res.send({
                flag: flag
            })
        }
    });
});

// router.post('/experience/save', function(req, res) {
//     var idcv = req.baseUrl.split("/")[2];
//     req.body.CV_Id = idcv;
//     var experience_save = new experience_service();
//     experience_save.save(req.body.Company,
//         req.body.Designation,
//         req.body.FromDate,
//         req.body.ToDate,
//         req.body.Details,
//         req.body.CV_Id);
//     var valid = experience_save.checkValidation();
//     if (valid) {
//         experience_save.save(experience_save.attribute, function(err, data) {
//             res.send({
//                 flag: err,
//                 resdata: data
//             });
//         });
//     } else {

//         res.send({
//             flag: 0,
//             resdata: experience_save.attrvalidate
//         });
//     }
// });

router.post('/experience/save', function(req, res) {
    var idcv = req.baseUrl.split("/")[2];
    req.body.CV_Id = idcv;
    var expService = di.resolve('experience');
    var expServiceIns = new expService();
    expServiceIns.saveExperience({
       "Company" : req.body.Company,
       "Designation" :req.body.Designation,
       "FromDate" :req.body.FromDate,
       "ToDate" :req.body.ToDate,
       "Details" :req.body.Details,
       "CV_Id" :req.body.CV_Id}, function (err,data){
           res.send({
               flag: err,
               resdata: data
           });
    });  
});

// router.post('/experience/update', function(req, res) {
//     var experience_update = new experience(req.body.Company,
//         req.body.Designation,
//         req.body.FromDate,
//         req.body.ToDate,
//         req.body.Details,
//         req.body.CV_Id
//     );

//     var valid = experience_update.checkValidation();
//     if (valid) {
//         experience_update.update(req.body.Id, function(err, data) {
//             res.send({
//                 flag: err,
//                 resdata: data
//             });
//         });
//     } else {

//         res.send({
//             flag: 0,
//             resdata: experience_update.attrvalidate
//         });
//     }
// });

router.post('/experience/update', function(req, res) {
    var idcv = req.baseUrl.split("/")[2];
    req.body.CV_Id = idcv;
    var userId = req.user.Id;
    var cvService = di.resolve('curriculum_vitae');
    var cvServiceIns = new cvService();
    cvServiceIns.checkCVBelongToUser(idcv, userId, function(flag, data){
        if(flag == 1){
            if(data == true){
                var expService = di.resolve('experience');
                var expServiceIns = new expService();
                expServiceIns.updateExperience({
                    "Id": req.body.Id,
                    "Company" : req.body.Company,
                    "Designation" :req.body.Designation,
                    "FromDate" :req.body.FromDate,
                    "ToDate" :req.body.ToDate,
                    "Details" :req.body.Details,
                    "CV_Id" :req.body.CV_Id}, function (err,data){
                        res.send({
                            flag: err,
                            resdata: data
                        }); 
                });
            }else{
                res.send({
                    flag: err,
                    msg: 'The CV you send belong to other user.'
                });
            }
        }else if (flag == -1){
            res.send({
                flag: flag
            })
        }
    });
});

// router.post('/experience/delete', function(req, res) {
//     var experience_delete = new experience();
//     experience_delete.remove(req.body.Id, function(err, data) {
//         res.send({
//             flag: err,
//             resdata: data
//         });
//     });
// });
// module.exports = router;

router.post('/experience/delete', function(req, res) {
    var idcv = req.baseUrl.split("/")[2];
    req.body.CV_Id = idcv;
    var userId = req.user.Id;
    var cvService = di.resolve('curriculum_vitae');
    var cvServiceIns = new cvService();
    cvServiceIns.checkCVBelongToUser(idcv, userId,  function(flag, data){
        if(flag == 1){
            if(data == true){
                var expService = di.resolve('experience');
                var expServiceIns = new expService();
                expServiceIns.deleteExperience(req.body.Id, function (err,data){
                        res.send({
                            flag: err,
                            resdata: data
                        }); 
                });
            }else{
                res.send({
                    flag: err,
                    msg: 'The CV you send belong to other user.'
                });
            }
        }else if (flag == -1){
            res.send({
                flag: flag
            })
        }
    });
});
module.exports = router;