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

router.get('/', function (req, res) {
    var cvService = di.resolve('curriculum_vitae');
    cvServiceIns = new cvService();
    cvServiceIns.getEnableCV({}, function (code, rows) {
        var resObject = {
            cvs: rows
        };
        res.render('pages/cv_list', resObject);
    })
});

router.post('/', [jsonparser], function (req, res) {
    var cvService = di.resolve('curriculum_vitae');
    cvServiceIns = new cvService();
    cvServiceIns.createCV({ Name: req.body.cvname, UserId: 1 }, function (flag, data) {
        var newidcv = data.Id;
        res.redirect("http://127.0.0.1:8080/cv/" + newidcv);
    });
});

router.post('/:idcv/update', [jsonparser], function (req, res) {
    var cvService = di.resolve('curriculum_vitae');
    cvServiceIns = new cvService();
    var paramObject = req.body;
    paramObject["Id"] = req.params.idcv;
    cvServiceIns.updateCV(paramObject, function (flag, data) {
        res.redirect("http://127.0.0.1:8080/cv/");
    });
});

router.post('/disableCV', [jsonparser], function (req, res) {

    // var dbcv_save = new cvmodel(req.body.Name, req.body.CreatedDate, req.body.IsDeleted, req.body.UrlSlug, 1, req.body.Id);
    var param = {
        id: req.body.id
    };
    var cvService = di.resolve('curriculum_vitae');
    cvServiceIns = new cvService();
    console.log('in');
    cvServiceIns.disableCV(param, function (code, data) {
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

// router.post('/:idcv', [jsonparser], function (req, res) {
//     var dbcv_save = new cvmodel(req.body.Name, req.body.CreatedDate, req.body.IsDeleted, req.body.UrlSlug, req.body.UserId, req.params.Id);
//     var valid = dbcv_save.checkValidation();
//     if (valid) {
//         dbcv_save.save(dbcv_save.attribute, function (err, data) {
//             res.send({ flag: err, data: data });
//         });
//     } else {
//         res.send({ flag: 0, data: dbcv_save.attrvalidate });
//     }
// });

/*router.get('/:idcv', function (req, res) {
    var idcv = req.params.idcv;
    dbcv.getByIdCV(idcv, function (data) {
        if (data.length > 0) {
            res.render('pages/cv_index', { data: data[0] });
        } else {
            res.render('pages/not_found_404');
        }
        if(err==1)
        {
            res.render('pages/cv_index', { data: data[0] });
        }
        if (err == 0) {
            res.status(404).render('pages/not_found_404');
        }
    });
});*/

router.get('/:idcv', function (req, res) {
    var param = { id: req.params.idcv };
    dbcv.getByIdCV(param, function (code, row) {
        if (code == 1) {
            res.render('pages/cv_index', { data: row })
        } else if (code == 0) {

        } else if (code == -1) {

        }
        // if (data.length > 0) {
        //     res.render('pages/cv_index', { data: data[0] });
        // } else {
        //     res.render('pages/not_found_404');
        // }
        // if(err==1)
        // {
        //     res.render('pages/cv_index', { data: data[0] });
        // }
        // if (err == 0) {
        //     res.status(404).render('pages/not_found_404');
        // }
    });
});


// router.get('/', function (req, res) {
//     dbcv.getAllCV(req, function (data) {
//         res.json(data);
//     });
// })



module.exports = router;
