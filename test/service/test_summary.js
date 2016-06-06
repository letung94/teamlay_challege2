var chai = require('chai');
var assert = require('chai').assert;
var expect = require('chai').expect;

var di = require('../../config/config');
var summaryModel = di.resolve('summary');


var sinon = require('sinon');



// var Firstname = "Trinh";
// var Lastname = "Nguyen";
// var Username = "Trinh.Nguyen";
// var Email = "email@email.com";
// var PasswordHash = "12asdasfasfqsf12e4asfdasf";
// var CreatedDate = "2016-02-01";
// var VerifyToken = "asdsaasdqww12323ewqedads1";
// var IsConfirmed = "0";
// var IsBlocked = "0";
// var ResetPasswordToken = "";
// var ResetPasswordExpire = "";

var Headline = "headline st";
var ProfessionalSummary = "asdasfhasdlk";
var CV_Id = "4";
var Id = "1";



describe('TEST summary!', function() {


    // var summary_test = new summaryModel();

    var summaryTest,
        eventEmitterStub,
        callbackSpy,
        clock;
    before(function() {
        summaryTest = new summaryModel(Headline, ProfessionalSummary, CV_Id, Id);
        // summaryTest.getByIdCV
        //clock = sinon.useFakeTimers();
        //  eventEmitterStub = sinon.stub(calculator, 'emit');
        callbackSpy = sinon.spy();
    });

    it('should summary', function() {
        summaryTest.getByIdCV(summaryTest, callbackSpy);
        assert.equal(callbackSpy.called, true);

    });
});