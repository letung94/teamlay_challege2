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

var parseDate = function(date){
    var res = "";
    var currentdate = new Date(date);
    var digitalmonth=((currentdate.getMonth()+1)>=10) ? (currentdate.getMonth()+1) : '0' + (currentdate.getMonth()+1);
    var digitaldate=((currentdate.getDate())>=10)? (currentdate.getDate()) : '0' + (currentdate.getDate());
    res = currentdate.getFullYear() + "/" + digitalmonth + "/" +  digitaldate;
    return res;
}

module.exports.createUnique = createUnique;
module.exports.checkFileExisted = checkFileExisted;
module.exports.escapeJson = escapeJson;
module.exports.parseDate = parseDate;
