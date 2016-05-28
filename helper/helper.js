var fs = require('fs');
var createUnique = function (prefix, suffix) {
    var time = (new Date()).getTime();
    return time;
}

var checkFileExisted = function (path) {
    fs.exists(path, function (exists) {
        console.log(exists);
        return exists;
    });
}

module.exports.createUnique = createUnique;