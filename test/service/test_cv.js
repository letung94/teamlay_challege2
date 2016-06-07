var chai = require('chai');
var assert = require('chai').assert;
var expect = require('chai').expect;

var cv_service = require('../../config/test_config').resolve('curriculum_vitae');

var sinon = require('sinon');
var cv_getAllCV, cv_getEnableCV, cv_disableCV, cv_getByIdCV, cv_createCV, cv_updateCV, cv_checkCVBelongToUser;

describe('TEST--SERVICE--CV -  functions!', function() {

    before(function() {
        cv_getByIdCV = new cv_service();
        cv_getEnableCV = new cv_service();
    });

    it('(getByIdCV) - should get correct object that we need', function() {
        var param = {
            idcv: 1,
            userid: 1,
        };
        cv_getByIdCV.getByIdCV(param, function(flag, data) {
            if (flag == 1) {

                expect(data.Name).to.equal('Programmer');

            } else if (flag == 0) {
                // res.status(404).render('pages/not_found_404');
            } else if (flag == -1) {
                // res.status(500).render('pages/generic_error');
            }
        });
    });

});