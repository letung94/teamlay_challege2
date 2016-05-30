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


router.post('/', [jsonparser], function (req, res) {
    var dbcv_save = new cvmodel(req.body.Name, req.body.CreatedDate, req.body.IsDeleted, req.body.UrlSlug, req.body.UserId, req.body.Id);
    var valid = dbcv_save.checkValidation();
    if (valid) {
        dbcv_save.save(dbcv_save.attribute, function (err, data) {
            if (err == 1) {
                var idcv=data.Id;
                res.redirect("http://localhost:8080/cv/"+idcv);
            }
            if (err == 0) {
                res.status(404).render('pages/not_found_404');
            }
            if (err == -1) {
                res.status(404).render('pages/not_found_404');
            }
        });
    } else {
        res.send({ flag: 0, data: dbcv_save.attrvalidate });
    }
});

router.post('/:idcv', [jsonparser], function (req, res) {
    var dbcv_save = new cvmodel(req.body.Name, req.body.CreatedDate, req.body.IsDeleted, req.body.UrlSlug, req.body.UserId, req.params.Id);
    var valid = dbcv_save.checkValidation();
    if (valid) {
        dbcv_save.save(dbcv_save.attribute, function (err, data) {
            res.send({ flag: err, data: data });    
        });
    } else {
        res.send({ flag: 0, data: dbcv_save.attrvalidate });
    }
});

router.get('/:idcv', function (req, res) {
    var idcv = req.params.idcv;
    dbcv.getByIdCV(idcv, function (err, data) {
        if (err == 1) {
            res.render('pages/cv_index', { data: data[0] });
        }
        if (err == 0) {
            res.status(404).render('pages/not_found_404');
        }
    });
});

router.get('/', function (req, res) {
    dbcv.getAllCV(req, function (data) {
        res.json(data);
    });
})

module.exports = router;