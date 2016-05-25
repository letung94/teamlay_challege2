
function db(host, user,pass,dbname,mysql){
    var self = this;
	this.host = host;
	this.user = user;
	this.pass = pass;
	this.dbname = dbname;
    this.mysql = mysql;
};

module.exports = db;