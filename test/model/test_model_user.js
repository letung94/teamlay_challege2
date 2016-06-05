var chai = require('chai');
var assert = require('chai').assert;
var expect = require('chai').expect;

var di = require('../../config/config');
var user_model = di.resolve('user');


var sinon = require('sinon');



var Firstname = "Trinh";
var Lastname = "Nguyen";
var Username = "Trinh.Nguyen";
var Email = "email@email.com";
var PasswordHash = "12asdasfasfqsf12e4asfdasf";
var CreatedDate = "2016-02-01";
var VerifyToken = "asdsaasdqww12323ewqedads1";
var IsConfirmed = "0";
var IsBlocked = "0";
var ResetPasswordToken = "";
var ResetPasswordExpire = "";




describe('TEST-MODEL-USER -- addUser Function!', function() {
    var user_01 = new user_model(Firstname, Lastname, Username, Email, PasswordHash, CreatedDate, VerifyToken, IsConfirmed, IsBlocked, ResetPasswordToken, ResetPasswordExpire);

    console.log('\n' + 'THIS IS SOMETHING');
    user_01.addUser(user_01.attribute, function(flag, err) {
        if (flag == -1) {
            console.log(err);
        } else {
            console.log('successful');
        }
    });

    beforeEach(function() {
        this.console = {
            log: sinon.spy()
        };
    });

    it('should return correct object with correct parameter values', function() {

        expect(user_01).to.be.an('Object');
        expect(user_01.attribute.Firstname).to.equal('Trinh');
        expect(user_01.attribute.Lastname).to.equal('Nguyen');
        expect(user_01.attribute.Username).to.equal('Trinh.Nguyen');
        expect(user_01.attribute.Email).to.equal('email@email.com');
        expect(user_01.attribute.PasswordHash).to.equal('12asdasfasfqsf12e4asfdasf');
        expect(user_01.attribute.CreatedDate).to.equal('2016-02-01');
        expect(user_01.attribute.VerifyToken).to.equal('asdsaasdqww12323ewqedads1');
        expect(user_01.attribute.IsConfirmed).to.equal('0');
        expect(user_01.attribute.IsBlocked).to.equal('0');
        expect(user_01.attribute.ResetPasswordToken).to.equal('');
        expect(user_01.attribute.ResetPasswordExpire).to.equal('');
    });
    it('should not return any type but object', function() {

        expect(user_01).to.not.be.an('String');
        expect(user_01).to.not.be.an('Int');
        expect(user_01).to.not.be.an('Function');
    });
    it('should return the same object', function() {

        expect(user_01.attribute.Firstname).to.not.equal('Cach');
        expect(user_01.attribute.Lastname).to.not.equal('Le');
        expect(user_01.attribute.Username).to.not.equal('Trinh..Nguyen');
        expect(user_01.attribute.Email).to.not.equal('12email@email.com');
        expect(user_01.attribute.PasswordHash).to.not.equal('sajkdkasd93842098sajdhasldj');
        expect(user_01.attribute.CreatedDate).to.not.equal('2016-02-02');
        expect(user_01.attribute.VerifyToken).to.not.equal('asdasdas21321312uy3123t');
        expect(user_01.attribute.IsConfirmed).to.not.equal('1');
        expect(user_01.attribute.IsBlocked).to.not.equal('1');
        expect(user_01.attribute.ResetPasswordToken).to.not.equal('123');
        expect(user_01.attribute.ResetPasswordExpire).to.not.equal('232');
    });

})