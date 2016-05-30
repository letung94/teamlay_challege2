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
    var dbcv_save = new cvmodel(req.body.Name, req.body.CreatedDate, req.body.IsDeleted, req.body.UrlSlug, 1, req.body.Id);
    dbcv_save.save(dbcv_save.attribute, function (err, data) {
        res.json({ flag: err, data: data });
        // var newid = data[0].newid;
        // res.redirect(newid);
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


    });
});

router.get('/', function (req, res) {
    dbcv.getAllCV(req, function (data) {
        res.json(data);
    });
})

module.exports = router;