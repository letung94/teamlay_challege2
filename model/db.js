
function db(host, user,pass,dbname,mysql){
    var self = this;
	this.host = host;
	this.user = user;
	this.pass = pass;
	this.dbname = dbname;
    this.mysql = mysql;
};



db.prototype.readCVById = function (req, callback) {
    var conn = this.mysql.createConnection({
        host: this.host,
        user: this.user,
        password: this.pass,
        database: this.dbname
    });
    if (conn) {
        try {
            conn.connect();
            var idcv = req.params.idcv;
            strquery='SELECT * FROM curriculum_vitae WHERE id=?';
            conn.query(strquery, [idcv], function (err, rows, fields) {
                var data = null;
                var flag=false;
                if (!err) {
                    data = rows;
                    flag=true;
                }
                else {
                    data = err;
                    console.log("There is error");
                }
                callback(flag,rows[0]);
                conn.end();
            });
        }
        catch (err) {
            console.log(err);
        }
    }
};

db.prototype.updateContactInfo=function(req,callback){
    var conn = this.mysql.createConnection({
        host: this.host,
        user: this.user,
        password: this.pass,
        database: this.dbname
    });
    if (conn) {
        try {
            conn.connect();
            var idcv = req.params.idcv;
            var firstname=req.body.firstname;
            var lastname=req.body.lastname;
            var email=req.body.email;
            var phone=req.body.phone;
            var website=req.body.website;
            var address=req.body.address;
            strquery="INSERT INTO contact_info(FirstName,LastName,Email,Phone,Website,Address,CV_Id) VALUES(?,?,?,?,?,?,?)";
            conn.query(strquery, [firstname,lastname,email,phone,website,address,idcv], function (err, rows, fields) {
                var data = null;
                var flag=false;
                if (!err) {
                    data = rows;
                    flag=true;
                }
                else {
                    data = err;
                    console.log("There is error");
                }
                callback(flag,data);
                conn.end();
            });
        }
        catch (err) {
            console.log(err);
        }
    }           
};



module.exports = db;