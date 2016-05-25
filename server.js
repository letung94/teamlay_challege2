var express = require('express');
var http = require('http');

var app = express();

//import dependency injection
var di = require('./config/config');
var db = di.resolve('db');
var ctrluser = di.resolve('ctrluser');

app.get('/start', function(req,res){
    res.end('<h1 style="color: red; text-align: center; margin: 200px auto 0px;">TEAM LAY - CHALLENGE2 - KICK OFF 24/5/2016-7/6/2016</h1>');
});


/*----------This is Nhieu's code----------*/
var bodyparser=require('body-parser');
// var connection  = require('express-myconnection'); 
// var mysql = require('mysql');
// var user=require('./controller/ctrluser');
// create application/json parser 
var jsonparser=bodyparser.json();
//connect do database
// app.use(
//     connection(mysql,{
//     host    :   'localhost',
//     user    :   'root',
//     password:   'root',
//     database:   'cv_maker'         
// },'pool')
// );
// var connection = mysql.createConnection({
//   host     : 'localhost',
//   user     : 'root',
//   password : 'root',
//   database : 'cv_maker'
// });
//user save contact information
app.get('/cv/:idcv',function(req,res){
    console.log('/cv/id');
    ctrluser.readcurriculumvitaebyid(req,function(data){
        res.end(data);    
    });        
});
app.post('/cv/:idcv/contact-info/update',jsonparser
// ,user.updatecontactinfo
    // function(req,res){
    // if(!req.body)   return res.sendStatus(400);
    // var firstname=req.body.firstname; 
    // var lastname=req.body.lastname; 
    // var email=req.body.email; 
    // var phone=req.body.phone; 
    // var website=req.body.website; 
    // var address=req.body.address; 
    // var idcv=req.params.idcv;
    // // connection.connect();
    // req.getConnection(function(err,connection){
        
    //     var query = connection.query('SELECT * FROM curriculum_vitae',function(err,rows)
    //     {
            
    //         if(err)
    //             console.log("Error Selecting : %s ",err );
        
    //         res.end(JSON.stringify(rows[0]));
                
            
    //         });
            
    //         //console.log(query.sql);
    // });
    // connection.query('SELECT * FROM curriculum_vitae', function(err, rows, fields) {
    // if (err) throw err;
    // res.end('The solution is: '+ JSON.stringify(rows[0]));
    // });
    
    // connection.query("INSERT INTO contact_info(FirstName,LastName,Email,Phone,Website,Address,CV_Id) VALUES(?,?,?,?,?,?,?)",[firstname,lastname,email,phone,website,address,idcv], function(err, rows, fields) {
    // if (err) throw err;
    // });
    // console.log("insert");
    // connection.query("SELECT * FROM contact_info",function(err, rows, fields) {
    //     if (err) throw err;
    //     res.end('The solution is: '+ JSON.stringify(rows[0]));
    // });
    // connection.end();
// }
);
/*--------------------*/
http.createServer(app).listen(8080,function(){
    console.log("let's read first");
    console.log("Trinh");

    console.log("Nhieu");

     console.log("Kiet Commit");

	console.log("Server running http://localhost:8080/start");
});
