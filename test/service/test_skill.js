var chai = require('chai');
var assert = require('chai').assert;
var expect = require('chai').expect;


var skill_service = require('../../config/test_config').resolve('skill');

var sinon = require('sinon');
var skill_getByIdCV, skill_save;


describe('TEST--SERVICE--SKILL - (getByIdCV) && (save) functions!', function() {

    before(function() {
        skill_getByIdCV = new skill_service();
        skill_save = new skill_service();
    });

    it('(getByIdCV) - should get correct object that we need', function() {
        skill_getByIdCV.getAllSkillByCVId({
            "CV_Id": 1
        }, function(err, data) {
            if (err) {

            } else {
                // /expect(rows.Headline).to.equal('Headline1');
            }
            expect(data.Name).to.equal('Nodejs');
            expect(data.Expertise).to.equal('5');
            expect(data.Experience).to.equal('6');
            expect(data.LastYearUsed).to.equal('2015');
        });
    });
    it('(save) - should save correct object that we want', function() {

        skill_save.save({
            "Name": "Nodejs",
            "Expertise": "5",
            "Experience": "6",
            "LastYearUsed": "2015",
            "CV_Id": 1
        }, function(err, data) {
            if (err) {

            } else {
                expect(data.Name).to.equal('Nodejs');
                expect(data.Expertise).to.equal('5');
                expect(data.Experience).to.equal('6');
                expect(data.LastYearUsed).to.equal('2015');
            }
        });

    });

});