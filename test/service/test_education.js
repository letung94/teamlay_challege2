// var chai = require('chai');
// var assert = require('chai').assert;
// var expect = require('chai').expect;

// var education_service = require('../../config/test_config').resolve('education');

// var sinon = require('sinon');
// var education_getAllEducationByCVI, education_getAllByIdCV;

// describe('TEST--SERVICE--EDUCATION -  functions!', function() {

//     before(function() {
//         //   /  education_getAllEducationByCVId = new education_service();

//     });

//     it('(getAllEducationByCVId) - should get correct object that we need', function() {
//         var education_getAllByIdCV = new education_service();

//         education_getAllByIdCV.getAllByIdCV(1, function(flag, rows) {
//             console.log('data');
//             if (flag == 1) {

//                 expect(rows.Institude).to.equal('UOS');

//             } else if (flag == 0) {
//                 // res.status(404).render('pages/not_found_404');
//             } else if (flag == -1) {
//                 // res.status(500).render('pages/generic_error');
//             }
//         });

//         // var param = {
//         //     idcv: 1,
//         //     userid: 1,
//         // };
//         // cv_getByIdCV.getByIdCV(param, function(flag, data) {
//         //     if (flag == 1) {

//         //         expect(data.Name).to.equal('Programmer');

//         //     } else if (flag == 0) {
//         //         // res.status(404).render('pages/not_found_404');
//         //     } else if (flag == -1) {
//         //         // res.status(500).render('pages/generic_error');
//         //     }
//         // });
//     });

// });