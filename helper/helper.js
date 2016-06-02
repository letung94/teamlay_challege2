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

var isPastOrCurrentDate = function(date){
    var now = new Date();
    
    var current_month = now.getMonth() + 1;
    var current_date = now.getDate();
    if (current_month.toString().length == 1)
        current_month = "0".concat(current_month).toString();
    if (current_date.toString().length == 1)
        current_date = "0".concat(current_date).toString();        
    var raw = date.replace('/', '').replace('/','');    
    var rawCurrent = now.getFullYear() + current_month + current_date;
    console.log(rawCurrent);
    console.log(raw)
    current = now.getFullYear()  + (now.getMonth() + 1).toString() + now.getDate();
    //console.log(parseInt(raw));
    
    if (parseInt(raw) > parseInt(rawCurrent))
        return false;
    else 
        return true; 
    // if (a[0] > now.getFullYear())
    //     return false;
    // else if (a[1] > now.getMonth() + 1)
    //     return false;
    // else if (a[2] > now.getDate())
    //     return false;
    // return true;
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
module.exports.isPastOrCurrentDate = isPastOrCurrentDate;
module.exports.parseDate = parseDate;
