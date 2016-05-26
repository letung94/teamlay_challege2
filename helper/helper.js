var createUnique = function(prefix, suffix){
    var time = (new Date()).getTime();
    console.log(time);
    return time;
}

var say = function(){
    console.log('say');
}

module.exports.createUnique = createUnique;
module.exports.say = say;