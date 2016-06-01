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

router.get('/', function(req, res) {
    // console.log("BIG: " + req.user.Id);
    var cvService = di.resolve('curriculum_vitae');
    cvServiceIns = new cvService();
    cvServiceIns.getEnableCV({}, function(flag, rows) {
        var resObject = {
            cvs: rows
        };
        if (flag != -1) {
            res.render('pages/cv_list', resObject);
        } else {
            res.status(500).render('pages/generic_error');
        }
    })
});

router.post('/', [jsonparser], function(req, res) {
    var cvService = di.resolve('curriculum_vitae');
    cvServiceIns = new cvService();
    cvServiceIns.createCV({
        Name: req.body.cvname,
        UserId: 1
    }, function(flag, data) {
        if (flag == 1) {
            var newidcv = data.Id;
            res.redirect("http://127.0.0.1:8080/cv/" + newidcv);
        } else if (flag == -1) {
            res.status(500).render('pages/generic_error');
        }
    });
});

router.post('/:idcv/update', [jsonparser], function(req, res) {
    var cvService = di.resolve('curriculum_vitae');
    cvServiceIns = new cvService();
    var paramObject = req.body;
    paramObject["Id"] = req.params.idcv;
    cvServiceIns.updateCV({
        Name: req.body.cvname,
        UserId: 1,
        Id: req.params.idcv
    }, function(flag, data) {
        var resData = {};
        if (flag == 1) {
            resData.IsSuccess = 1;
            resData.Name = data.Name;
        } else if (flag == 0) {
            resData.IsSuccess = 0;
            resData.Error = data;
        } else {
            resData.IsSuccess = -1;
            resData.Error = data;
        }
        res.json(resData);
    });
});

router.post('/disableCV', [jsonparser], function(req, res) {

    // var dbcv_save = new cvmodel(req.body.Name, req.body.CreatedDate, req.body.IsDeleted, req.body.UrlSlug, 1, req.body.Id);
    var param = {
        id: req.body.id
    };
    var cvService = di.resolve('curriculum_vitae');
    cvServiceIns = new cvService();
    console.log('in');
    cvServiceIns.disableCV(param, function(code, data) {
        console.log('done');
        console.log(code);
        var resData = {};
        if (code == 1) {
            resData.IsSuccess = true;
        } else {
            resData.IsSuccess = false;
        }
        res.json(resData);
    })
});

router.get('/:idcv', function(req, res) {
    var param = {
        id: req.params.idcv
    };
    dbcv.getByIdCV(param, function(code, row) {
        if (code == 1) {
            res.render('pages/cv_index', {
                data: row
            });
        } else if (code == 0) {
            res.status(404).render('pages/not_found_404');
        } else if (code == -1) {
            res.status(500).render('pages/generic_error');
        }
    });
});



module.exports = router;