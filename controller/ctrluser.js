/*----------This is Nhieu's code----------*/
function ProcessDBUserMysql(connectiondb) {
    this.connectionmysql = connectiondb;
};

ProcessDBUserMysql.prototype.readcurriculumvitaebyid = function (req, callback) {
    console.log("processing");
    // console.log(this.connectionmysql.host,
    //     this.connectionmysql.user,
    //     this.connectionmysql.pass,
    //     this.connectionmysql.dbname    );
    var conn = this.connectionmysql.mysql.createConnection({
        host: this.connectionmysql.host,
        user: this.connectionmysql.user,
        password: this.connectionmysql.pass,
        database: this.connectionmysql.dbname
    });
    //console.log(conn);
    if (conn) {
        try {
            conn.connect();
            var idcv = req.params.idcv;
            conn.query('SELECT * FROM curriculum_vitae WHERE id=?', [idcv], function (err, rows, fields) {
                var data = {};
                if (!err) {
                    data = rows[0].firstname;
                }
                else {
                    data = false;
                    console.log("There is error");
                }
                callback(rows[0]);
                // callback(data);
                conn.end();
                console.log("the");
            });
        }
        catch (err) {
            console.log(err);
        }
    }
};

module.exports = ProcessDBUserMysql;

// exports.updatecontactinfo = function (req, res) {
//     if (!req.body) return res.sendStatus(400);
//     var firstname = req.body.firstname;
//     var lastname = req.body.lastname;
//     var email = req.body.email;
//     var phone = req.body.phone;
//     var website = req.body.website;
//     var address = req.body.address;
//     var idcv = req.params.idcv;
//     // connection.connect();
//     req.getConnection(function (err, connection) {

//         var query = connection.query('SELECT * FROM curriculum_vitae', function (err, rows) {

//             if (err)
//                 console.log("Error Selecting : %s ", err);

//             res.end(JSON.stringify(rows[0]));


//         });

//         //console.log(query.sql);
//     });
// };
// /*--------------------*/