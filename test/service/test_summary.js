// var chai = require('chai');
// var assert = require('chai').assert;
// var expect = require('chai').expect;

// var di = require('../../config/test_config');
// var summaryModel = di.resolve('summary');

// var summary_service = require('../../config/test_config').resolve('summary');

// var sinon = require('sinon');
// var summary_getByIdCV, summary_save;


// describe('TEST--SERVICE--SUMMARY - (getByIdCV) && (save) functions!', function() {

//     before(function() {
//         summary_getByIdCV = new summary_service();
//         summary_save = new summary_service();
//     });

//     it('(getByIdCV) - should get correct object that we need', function() {
//         summary_getByIdCV.getByIdCV({
//             "CV_Id": 1
//         }, function(err, rows) {
//             if (err) {

//             } else {
//                 expect(rows.Headline).to.equal('Headline1');
//             }
//             expect(rows.Headline).to.equal('Headline1');
//             expect(rows.Professional).to.equal('Pro1');
//             expect(rows.CV_Id).to.equal('1');
//         });
//     });
//     it('(save) - should save correct object that we want', function() {
//         summary_save.save({
//             "Headline": "Headline2",
//             "ProfessionalSummary": "Pro2",
//             "CV_Id": "1",
//         }, function(err, data) {
//             if (err) {

//             } else {
//                 expect(data.Headline).to.equal('Headline2');
//                 expect(data.Professional).to.equal('Headline2');
//                 expect(data.CV_Id).to.equal('1');
//             }
//         });

//     });

// });