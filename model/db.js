
function db(host, user,pass,dbname,mysql){
    var self = this;
	this.host = host;
	this.user = user;
	this.pass = pass;
	this.dbname = dbname;
    this.mysql = mysql;
    this.connect = function(){
        console.log('connect db %s %s %s %s', self.host, self.user, self.pass, self.dbname );
    }
}

module.exports = db;