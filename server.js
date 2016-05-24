var express = require('express');
var http = require('http');

var app = express();

//import dependency injection
var di = require('./config/config');
var db = di.resolve('db');
db.connect();

app.get('/start', function(req,res){
    res.end('<h1 style="color: red; text-align: center; margin: 200px auto 0px;">TEAM LAY - CHALLENGE2 - KICK OFF 24/5/2016-7/6/2016</h1>');
});

http.createServer(app).listen(8080,function(){
    console.log("let's read first");
    console.log("Trinh");
     console.log("Kiet Commit");
	console.log("Server running http://localhost:8080/start");
});
