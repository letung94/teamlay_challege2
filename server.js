var express = require('express');
var http = require('http');
var ejs = require('ejs');
var app = express();
var path = require('path');

// require router.
var template = require('./controller/ctrltemplate');

//public file in the public_datasource

app.use('*/assets', express.static(__dirname + '/public_datasource/assets'));
app.use('*/css', express.static(__dirname + '/public_datasource/css'));
app.use('*/js', express.static(__dirname + '/public_datasource/js'));
app.use('*/img', express.static(__dirname + '/public_datasource/img'));

app.use('*/cover', express.static(__dirname + '/view/templates/cover'));

app.set('views', path.join(__dirname, 'view')); 
app.set('view engine', 'ejs'); 

// declare router
app.use('/template', template);


app.get('/start', function(req,res){
    res.end('<h1 style="color: red; text-align: center; margin: 200px auto 0px;">TEAM LAY - CHALLENGE2 - KICK OFF 24/5/2016-7/6/2016</h1>');
});

/*----------This is Nhieu's code----------*/
var ctrluser=require('./controller/ctrluser');
app.use('/',ctrluser);
/*--------------------*/



app.get('/ci',function(req,res){
    res.render('pages/cv_index');
})


http.createServer(app).listen(8080,function(){
    console.log("let's read first");
	console.log("Server running http://localhost:8080/start");
});
