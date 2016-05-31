var summary = require('../model/summary');

function summary_service() {
    this.getAllSummaryByCVId = function (params, callback) {
        var s = new summary();
        s.getAllSummaryByCVId(params, callback);
    }
}

module.exports = summary_service;

