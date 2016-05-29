var express = require('express');
var http = require('http');
var ejs = require('ejs');
var app = express();
var path = require('path');
var bodyparser=require('body-parser');
//var jsonparser = bodyparser.json();

//public file in the public_datasource

app.use('*/assets', express.static(__dirname + '/public_datasource/assets'));
app.use('*/css', express.static(__dirname + '/public_datasource/css'));
app.use('*/js', express.static(__dirname + '/public_datasource/js'));
app.use('*/img', express.static(__dirname + '/public_datasource/img'));
app.use('*/avatars', express.static(__dirname + '/avatars'));
/* Cover for template */
app.use('*/cover', express.static(__dirname + '/view/templates/cover'));
/* CSS for template */
app.use('*/templatecss', express.static(__dirname + '/view/templates/css'));

app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs');

/*http://stackoverflow.com/questions/19917401/node-js-express-request-entity-too-large */
app.use(bodyparser.json({limit: '6mb'}));
app.use(bodyparser.urlencoded({limit: '6mb', extended: true}));


// Routing
var ctrluser = require('./controller/ctrluser');
app.use('/', ctrluser);
var ctrlcv = require('./controller/ctrlcv');
app.use('/cv', ctrlcv);

var ctrlTemplate = require('./controller/ctrltemplate');
app.use('/template', ctrlTemplate);


app.get('/cv', function (req, res) {
    res.render('pages/cv_index');
})


/*contact info */
var ctrlcontact_info = require('./controller/ctrlcontact_info');
app.use('/cv/:idcv',ctrlcontact_info);

app.use(function(req, res, next) {
  res.status(404).render('pages/not_found_404');
});

http.createServer(app).listen(8080, function() {
    var port = this.address().port;
    console.log("let's read first");
    console.log("Server is listening at http://localhost:%s", port);
});
