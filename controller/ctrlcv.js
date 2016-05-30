var express = require('express');
var bodyparser = require('body-parser');
var ejs = require('ejs');

var di = require('../config/config');

var dbcv = di.resolve('cv');
var cvmodel = require('../model/cv');
var dbuser = di.resolve('user');
var app = express();
var jsonparser = bodyparser.json();
var router = express.Router();

router.get('/list', function (req, res) {
    var cvService = di.resolve('curriculum_vitae');
    cvServiceIns = new cvService();
    cvServiceIns.getEnableCV({}, function(code, rows){
        var resObject = {
            cvs: rows
        };
        res.render('pages/cv_list',resObject);
    })
});

router.post('/', [jsonparser], function (req, res) {
    var dbcv_save = new cvmodel(req.body.Name, req.body.CreatedDate, req.body.IsDeleted, req.body.UrlSlug, 1, req.body.Id);
    dbcv_save.save(dbcv_save.attribute, function (err, data) {
        res.json({ flag: err, data: data });
        // var newid = data[0].newid;
        // res.redirect(newid);
    })
});

router.post('/disableCV', [jsonparser], function (req, res) {
    // var dbcv_save = new cvmodel(req.body.Name, req.body.CreatedDate, req.body.IsDeleted, req.body.UrlSlug, 1, req.body.Id);
    var param = {
        id: req.body.id
    };
    var cvService = di.resolve('curriculum_vitae');
    cvServiceIns = new cvService();
    cvServiceIns.disableCV(param, function(code, data){
        var resData ={};
        if(code == 1){
            resData.IsSuccess = true;
        }else {
                resData.IsSuccess = false;
        }
        res.json(resData);
    })
});

router.post('/:idcv', [jsonparser], function (req, res) {
    dbcv.updateCV(req, function (data) {
        res.json(data);
    })
});

router.get('/:idcv', function (req, res) {
    var idcv = req.params.idcv;
    dbcv.getByIdCV(idcv, function (err, data) {
<<<<<<< HEAD
        res.json({ flag: err, data: data });
         //res.render('pages/cv_index',{data});
    });
});
/*
router.get('/:idcv', function (req, res) {
    var idcv = req.params.idcv;
    dbcv.getByIdCV(idcv, function (data) {
        if (data.length > 0) {
            res.render('pages/cv_index', { data: data[0] });
        } else {
            res.render('pages/not_found_404');
        }
=======
        if(err==1)
        {
            res.render('pages/cv_index', { data: data[0] });
        }
        if(err==0){
            res.render('pages/not_found_404');
        }
    });
});

router.get('/:idcv', function (req, res) {5
    dbcv.getCV(req, function (data) {

>>>>>>> 1bd1e194c51c12551a48c2a6fd652dd127e05125

    });
});*/

router.get('/', function (req, res) {
    dbcv.getAllCV(req, function (data) {
        res.json(data);
    });
})



module.exports = router;
