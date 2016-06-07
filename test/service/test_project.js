var chai = require('chai');
var assert = require('chai').assert;
var expect = require('chai').expect;


var project_service = require('../../config/test_config').resolve('project');

var sinon = require('sinon');
var project_getAllProjectByCVId, project_save;


describe('TEST--SERVICE--PROJECT - (getByIdCV) && (save) functions!', function() {

    before(function() {
        project_getAllProjectByCVId = new project_service();
        project_save = new project_service();
    });

    it('(getByIdCV) - should get correct object that we need', function() {

        project_getAllProjectByCVId.getAllProjectByCVId({
            "CV_Id": 1
        }, function(err, data) {
            if (err) {

            } else {
                // /expect(rows.Headline).to.equal('Headline1');
            }
            expect(data.Title).to.equal('Angular');
            expect(data.Url).to.equal(null);
            expect(data.FromDate).to.equal('2015-10-10');
            expect(data.ToDate).to.equal('2016-05-02');
            expect(data.Detail).to.equal('website');
        });
    });
    it('(save) - should save correct object that we want', function() {

        skill_save.save({
            "Title": "Nodejs",
            "Url": "",
            "FromDate": "2013-10-10",
            "ToDate": "2014-10-10",
            "Detail": "website",
            "CV_Id": 1,
        }, function(err, data) {
            if (err) {

            } else {
                expect(data.Title).to.equal('Nodejs');
                expect(data.Url).to.equal('');
                expect(data.FromDate).to.equal('2013-10-10');
                expect(data.ToDate).to.equal('2014-10-10');
                expect(data.Detail).to.equal('website');
            }
        });

    });

});