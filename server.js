var express = require('express');
var http = require('http');
var ejs = require('ejs');
var app = express();
var path = require('path');
var bodyparser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var mailer = require('express-mailer');
var flash = require('express-flash');
var helper = require('./helper/helper');
var scheduler = require('node-schedule');

// Email sending config
mailer.extend(app, {
    from: 'no-reply@cvmaker.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
        user: 'hvn.cvmaker',
        pass: '01269848891'
    }
});

/* Schedule to clean temp folder every 30 minutes */
var j = scheduler.scheduleJob('*/30 * * * *', function() {
    console.log('Clean temp folder.');
    helper.cleanTempFolder();
})

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
app.use(flash());
app.use(bodyparser.json({
    limit: '6mb'
}));
app.use(bodyparser.urlencoded({
    limit: '6mb',
    extended: true
}));
app.use(session({
    secret: 'vidyapathaisalwaysrunning',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

module.exports = app;

// Routing

var ctrlTemplate = require('./controller/ctrltemplate');
var ctrlcv = require('./controller/ctrlcv');
var ctrlAccount = require('./controller/ctrlaccount');
var ctrlSummary = require('./controller/ctrlsummary');
var ctrladmin = require('./controller/ctrladmin');
var authenticate = require('./middleware/authenticate');

app.use(function(req, res, next) {
    if (req.user != null) {
        res.locals.user = req.user;
    } else {
        res.locals.user = {
            Firstname: "Lầy-er",
            Lastname: ""
        };
    }
    next();
});

/*Index page*/
app.get('/', function(req, res) {
    var dataRender = {};
    if (req.user) {
        dataRender = {
            user: req.user
        };
        res.render('pages/index', dataRender);
    } else {
        res.render('pages/index');
    }
})



app.use('/cv', authenticate.requireAuthenticated, ctrlcv);
app.use('/template',authenticate.requireAuthenticated, ctrlTemplate);

app.use('/update-profile', authenticate.requireAuthenticated);
app.use('/change-password', authenticate.requireAuthenticated);

app.use('/', ctrlAccount);

app.use('/', ctrladmin);

app.get('/cv', function(req, res) {
    res.render('pages/cv_index');
})

var cv_user = require('./middleware/checkcv_user').isBlong;

/*contact info */
var ctrlcontact_info = require('./controller/ctrlcontact_info');
app.use('/cv/:idcv', cv_user, ctrlcontact_info);

/*summary */
var ctrlsummary = require('./controller/ctrlsummary');
app.use('/cv/:idcv', ctrlsummary);

/*education*/
var ctrleducation = require('./controller/ctrleducation');
app.use('/cv/:idcv', ctrleducation);

/*experience*/
var ctrlexperience = require('./controller/ctrlexperience');
app.use('/cv/:idcv', cv_user, ctrlexperience);

/*certification*/
var ctrlcertification = require('./controller/ctrlcertification');
app.use('/cv/:idcv', ctrlcertification);

/*project*/
var ctrlproject = require('./controller/ctrlproject');
app.use('/cv/:idcv', cv_user, ctrlproject);

/*
// skill
 */
var ctrlskill = require('./controller/ctrlskill');
app.use('/cv/:idcv', cv_user, ctrlskill);

/*
// cv_section
 */

var cv_section = require('./controller/ctrlcv_section');
app.use('/cv/:idcv', cv_section);

/*admin*/
app.get('/error/500', function(req, res) {
    res.render('pages/server_error_500');
});


/*var di = require('./config/config');
var c = di.resolve('certification');
cc = new c();
cc.getAllCertificationByCVId({CV_Id: 1}, function(rows){
console.log(rows);
})*/

/*var di = require('./config/config');
var c = di.resolve('curriculum_vitae');
cc = new c();
cc.checkCVBelongToUser(1,1, function(code, data){
    console.log('----');
    console.log(code);
    console.log(data);
})*/
// console.log(rows);

/*var di = require('./config/config');
var c = di.resolve('certification');
cc = new c();
cc.removeCertification({id: 9}, function(rows){
console.log(rows);
})*/

// var di = require('./config/config');
// var c = di.resolve('contact_info');
// cc = new c();
// cc.getByIdCV({CV_Id: 1}, function(code, res){
//     console.log(code);
//     console.log(res);
// });


app.use(function(req, res, next) {
    res.status(404).render('pages/not_found_404');
});

http.createServer(app).listen(8080, function() {
    var port = this.address().port;
    console.log("let's read first");
    console.log("Server is listening at http://localhost:%s", port);
});