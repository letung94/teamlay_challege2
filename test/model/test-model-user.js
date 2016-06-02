var chai = require('chai');
var assert = require('chai').assert;
var expect = require('chai').expect;
var User = require('../../config/config').resolve("db").User;

var userModel = require('../../model/user.js');


describe('user', function() {
    it('should return correct if available', function() {
        var usermodel_01 = new userModel();
        var user_01 = new User();
        var addUser = usermodel_01.addUser(user_01, function() {
            console.log('this is something');
            console.log(typeof(addUser));
        });
        expect(user_01).to.be.an('Object');
        console.log(user_01);
        expect(addUser).to.be.an('undefined');

    });
    // it('should return the input on a missing phrase', function() {
    //     assert.equal(i18n('football'), 'football');
    //     assert.equal(i18n('football', 'es'), 'football');
    //     assert.equal(i18n('beer', 'jp'), 'beer');
    // });
    // it('should handle mixed case', function() {
    //     assert.equal(i18n('Beer', 'es'), 'cervesa');
    // });
})