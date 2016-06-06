var cv_service = require('../config/config').resolve('curriculum_vitae');

var isBlong = function(req, res, next) {
    var cv_id = req.baseUrl.split("/")[2];
    if (req.params.idcv) {
        cv_id = req.params.idcv;
    }
    var userId = req.user.Id;
    //var cvService = di.resolve('curriculum_vitae');
    var cvServiceIns = new cv_service();
    cvServiceIns.checkCVBelongToUser(cv_id, userId, function(flag, data) {
        if (flag == 1) {
            if (data == true) { /*This cv_id belong to this user*/
                next();
            } else { /*This cv_id not belong to this user*/
                return res.json({
                    flag: flag,
                    msg: 'The CV you send belong to other user.'
                });
            }
        } else if (flag == -1) { /*Somethong wrong with server*/
            return res.json({
                flag: flag,
                msg: ''
            });
        }
    })
}

module.exports = {
    isBlong: isBlong
}