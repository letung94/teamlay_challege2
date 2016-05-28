function User() {
    var dbuser = require('../config/config').resolve("db").User;
    this.getAllUser = function() {
        user = new dbuser();
        user.find('all', function(err, rows, fields){
            console.log(rows[0]);
        });
    }
    
}

module.exports = User;