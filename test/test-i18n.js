var assert = require('chai').assert;
var i18n = require('../test/i18n');


describe('i18n', function() {
    it('should return correct translation if available', function() {
        assert(i18n('hello'), 'hello');
        assert(i18n('hello', 'en'), 'hello');
        assert(i18n('hello', 'es'), 'hola');
        assert(i18n('beer', 'es'), 'cervesa');

    });
    it('should return the input on a missing phrase', function() {
        assert.equal(i18n('football'), 'football');
        assert.equal(i18n('football', 'es'), 'football');
        assert.equal(i18n('beer', 'jp'), 'beer');
    });
    it('should handle mixed case', function() {
        assert.equal(i18n('Beer', 'es'), 'cervesa');
    });
})