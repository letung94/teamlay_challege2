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
        certification_getAllCertificationByCVId.getAllCertificationByCVId(1, function(err, rows) {
            if (err) {

            } else {}
            expect(rows[0].Title).to.equal('English');
            expect(rows.Professional).to.equal('Pro1');
            expect(rows.CV_Id).to.equal('1');
        });
    });
    it('(saveCertification) - should save correct object that we want', function() {
        var entity = {
            "Title": "AJAX 101",
            "CertificateAuthority": "WWW3school",
            "Date": "2014-05-04",
            "Details": "this is certification",
            "CV_Id": "1",

        };
        //entity.CV_Id = idcv;
        certification_saveCertification.saveCertification(entity, function(err, data) {
            if (err) {

            } else {
                expect(data.Title).to.equal('AJAX 101');
                expect(data.CertificateAuthority).to.equal('WWW3school');
                expect(data.Date).to.equal('2014-05-04');
                expect(data.Details).to.equal('this is certification');
                expect(data.CV_Id).to.equal('1');
            }
        })

    });

});