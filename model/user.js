console.log('User.js');
var di =  require('../config/config');
var user = di.resolve("db").User;


function User() {
    
    this.getAllUser = function() {
        user = new this.User();
        user.find('all', function(err, rows, fields){
            console.log(rows[0]);
        });
    }
}

module.exports = User;