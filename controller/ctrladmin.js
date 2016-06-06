var express = require('express');
var router = express.Router();
var admin_service = require('../config/config').resolve('admin');


router.get('/admin', function (req, res) {

    var service = new admin_service();
    service.getAllUser(function (flag, err, data) {
        if (flag == -1) {
            return res.render('server_error/500');
        }
        var data_json = JSON.stringify(data);
        var temp_json = JSON.parse(data_json);
        res.render('pages/admin', {
            users: temp_json
        });
    })
});

module.exports = router;