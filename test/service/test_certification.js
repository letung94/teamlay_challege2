var chai = require('chai');
var assert = require('chai').assert;
var expect = require('chai').expect;


var certification_service = require('../../config/test_config').resolve('certification');
var temp;

var sinon = require('sinon');
var certification_getAllCertificationByCVId, certification_saveCertification, certification_deleteCertification;


describe('TEST--SERVICE--CERTIFICATION - (getAllCertificationByCVId) && (saveCertification) && (deleteCertification) functions!', function() {

    before(function() {
        certification_getAllCertificationByCVId = new certification_service();
        certification_saveCertification = new certification_service();
        certification_deleteCertification = new certification_service();
    });

    it('(getAllCertificationByCVId) - should get all correct objects that we need', function() {
        // var cv_id = req.baseUrl.split("/")[2];
        // var userId = req.user.Id;
        // var cerService = di.resolve('certification');
        // var cerServiceIns = new cerService();

        // cerServiceIns.getAllCertificationByCVId(cv_id, function(err, rows) {
        //     return res.json({
        //         flag: err,
        //         rows: rows
        //     });
        // });


        certification_getAllCertificationByCVId.getAllCertificationByCVId(1, function(err, rows) {
            if (err) {

            } else {}
            expect(rows[0].Title).to.equal('English');
            expect(rows.Professional).to.equal('Pro1');
            expect(rows.CV_Id).to.equal('1');
        });
    });
    // it('(save) - should save correct object that we want', function() {
    //     summary_save.save({
    //         "Headline": "Headline2",
    //         "ProfessionalSummary": "Pro2",
    //         "CV_Id": "1",
    //     }, function(err, data) {
    //         if (err) {

    //         } else {
    //             expect(data.Headline).to.equal('Headline2');
    //             expect(data.Professional).to.equal('Headline2');
    //             expect(data.CV_Id).to.equal('1');
    //         }
    //     });

    // });

});