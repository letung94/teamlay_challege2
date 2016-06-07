var chai = require('chai');
var assert = require('chai').assert;
var expect = require('chai').expect;

var contact_info_service = require('../../config/test_config').resolve('contact_info');

var sinon = require('sinon');
var contact_info_getByIdCV, contact_info_save;

describe('TEST--SERVICE--CONTACT INFO - (getByIdCV) && (save) functions!', function() {

    before(function() {
        contact_info_getByIdCV = new contact_info_service();
        contact_info_save = new contact_info_service();
    });

    it('(getByIdCV) - should get correct object that we need', function() {

        contact_info_getByIdCV.getByIdCV({
            "CV_Id": '1'
        }, function(err, rows) {
            if (err) {

            } else {

            }
            expect(rows.FirstName).to.equal('Trinh');
            expect(rows.LastName).to.equal('Nguyen');
            expect(rows.Email).to.equal('nguyenquoctrinhctt3@gmail.com');
            expect(rows.Phone).to.equal('+841217706246');
            expect(rows.Website).to.equal('trinhnguyen.blog.com');
            expect(rows.Address).to.equal('ho chi minh');
            expect(rows.Avatar).to.equal(null);
            expect(rows.CV_Id).to.equal('1');
        });
    });
    it('(save) - should save correct object that we want', function() {

        contact_info_save.save({
            "FirstName": "Duy",
            "LastName": "Bui",
            "Avatar": null,
            "Email": "DuyBui@gmail.com",
            "Phone": "+84166883438",
            "Website": "www.google.com",
            "Address": "ha noi",
            "CV_Id": 1,
        }, function(err, data) {
            console.log(data);

            if (err) {
                //  console.log('Error!!');
            } else {
                // expect(data.FirstName).to.equal('Duy');
                // expect(data.LastName).to.equal('Bui');
                // expect(data.Email).to.equal('DuyBui@gmail.com');
                // expect(data.Phone).to.equal('+84166883438');
                // expect(data.Website).to.equal('www.google.com');
                // expect(data.Address).to.equal('ha noi');
                // expect(data.Avatar).to.equal(null);
                // expect(data.CV_Id).to.equal('1');
            }
        });
    });

});