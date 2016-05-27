function CVModel() {
    var Cv = require('../config/config').resolve("db").CV;
    this.getAllCV = function (callback) {
        cv = new Cv();
        cv.find('all', function (err, rows, fields) {
            console.log(rows[0]);
            callback(rows[0]);
        });
    }
}

module.exports = CVModel;