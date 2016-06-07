var chai = require('chai');
var assert = require('chai').assert;
var expect = require('chai').expect;


var admin_service = require('../../config/config').resolve('admin');
var ds = new admin_service();

describe('TEST--SERVICE--SUMMARY - (getByIdCV) and (save) function!', function() {

    // before(function() {
    //     var admin_get = new admin_service();
    // });

    // it('(getByIdCV) - should get correct object that we need', function() {
    //     // summary_getByIdCV.getByIdCV({
    //     //     "CV_Id": 1
    //     // }, function(err, rows) {
    //     //     if (err) {

    //     //     } else {
    //     //         expect(rows.Headline).to.equal('Headline1');
    //     //     }
    //     //     expect(rows.Headline).to.equal('Headline1');
    //     //     expect(rows.Professional).to.equal('Pro1');
    //     //     expect(rows.CV_Id).to.equal('1');
    //     // });
    // });


});