var fs = require('fs');
var jsesc = require('jsesc');

var createUnique = function (prefix, suffix) {
    var time = (new Date()).getTime();
    return time;
}

var checkFileExisted = function (path) {
    fs.exists(path, function (exists) {
        return exists;
    });
}

var escapeJson = function(entity){
    for(var attributename in entity){
        entity[attributename] = jsesc(entity[attributename]);
    }
    return entity;
}

module.exports.createUnique = createUnique;
module.exports.checkFileExisted = checkFileExisted;
module.exports.escapeJson = escapeJson;
