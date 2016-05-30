var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var helper = require('../helper/helper');
var pdf = require('../helper/pdf');

var demoInfo = {
	summary:{
		Headline: 'Some shinny Headline',
		ProfessionalSummary: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
	},
	contact_info: {
		FirstName: 'Lý Chấn',
		LastName: 'Kiệt',
		Email: 'kietlyc@harveynash.vn',
		Phone: '0933.299.615',
		Website: 'http://slither.io/',
		Address: '280 An Dương Vương Quận 5, TPHCM',
	},
	experiences: [
		{
			Company: 'FPT Software.',
			Designation: 'Software Engineer',
			FromDate: '1/10/2016',
			ToDate: '1/10/2018',
			Details: 'I am an outgoing and energetic (ask anybody) young professional,' +
			'seeking a career that fits my professional skills, personality, and' +
			'murderous tendencies. My squid-like head is a masterful problem' +
			'solver and inspires fear in who gaze upon it. I can bring world' +
			'domination to your organization.'
		},
		{
			Company: 'Global CyberSoft.',
			Designation: 'Technical Architect',
			FromDate: '01/01/2018',
			ToDate: '10/1/2020',
			Details: 'I am an outgoing and energetic (ask anybody) young professional,' +
			'seeking a career that fits my professional skills, personality, and' +
			'murderous tendencies. My squid-like head is a masterful problem' +
			'solver and inspires fear in who gaze upon it. I can bring world' +
			'domination to your organization.'
		},
		{
			Company: 'Harveynash',
			Designation: 'Project Manager',
			FromDate: '01/01/2020',
			ToDate: '01/01/9999',
			Details: 'I am an outgoing and energetic (ask anybody) young professional,' +
			'seeking a career that fits my professional skills, personality, and' +
			'murderous tendencies. My squid-like head is a masterful problem' +
			'solver and inspires fear in who gaze upon it. I can bring world' +
			'domination to your organization.'
		},
	],
	skills: [
		{
			Name: 'Office skills',
			Level: '5',
			Maturity: 'Office and records management, database administration, event organization, customer support, travel coordination',
			LastTime: 'Now',
		},
		{
			Name: 'Computer skills',
			Level: '5',
			Maturity: 'Microsoft productivity software (Word, Excel, etc), Adobe Creative Suite, Windows',
			LastTime: 'Now',
		},
		{
			Name: 'FPS',
			Level: 'Over 9000.',
			Maturity: 'I can shoot down multiple enemy at once even without using my eyes.',
			LastTime: 'Now',
		},
	],
	educations: [
		{
			Institute: 'University of Pedagogy',
			Degree: 'Bachelor\'s degree',
			FromDate: '27/05/2010',
			ToDate: '27/05/2015',
			Details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
		},
		{
			Institute: 'University of Science',
			Degree: 'Bachelor\'s degree',
			FromDate: '27/05/2010',
			ToDate: '27/05/2015',
			Details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
		},
	],
	certifications: [
		{
			Title: 'ScrumMaster',
			CertificateAuthority: '5',
			Date: '27/05/2010',
			Details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
		},
		{
			Title: 'Project Manger',
			CertificateAuthority: '4',
			Date: '27/05/2010',
			Details: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
		}
	]
}

router.get('/templateReview/:name', function (req, res) {
	var name = req.params.name;
	var templatePath = path.join(__dirname + '/../view/templates/' + name);
	fs.exists(templatePath, function (exist) {
		if(exist){
			res.render('templates/' + name, demoInfo);
		}else{
			res.render('pages/generic_error', {ExcludeHeader: '1', Title:'CV Template not found',Code: '404',
			Detail: 'The template you given is not exist or under maintenance, please try again later.'});
		}
	});
});

router.get('/template_list/', function (req, res) {
	files = [];
	var dir = __dirname + '/../view/templates';
	fs.readdir(dir, function (err, filesFromDisk) {
		if (err) { return; }
		filesFromDisk.forEach(function (f) {
			var name = dir + '/' + f;
			if (!fs.statSync(name).isDirectory()) {
				files.push(f);
			}
		});
		res.render('pages/template_list', { files: files });
	});
});

router.get('/download/:name', function (req, res) {
	var name = req.params.name; // Template file name.
	var source =  req.headers.host + '/template/templateReview/' + name + '.ejs'; // Get from template review page.
	var destination = path.join(__dirname + '/../tmp/', helper.createUnique() + '.pdf'); // Declare temporarily save folder.
	var options = {
		format:req.query.format,
		orientation: req.query.orientation,
		zoom : req.query.zoom,
		marginTop : req.query.marginTop,
		marginRight : req.query.marginRight,
		marginBottom : req.query.marginBottom,
		marginLeft : req.query.marginLeft
	}; // Options about the pdf that going to be exports.

	var connected = true; // keep track of user connection.
	req.on("close", function () { // Fire when user disconnect (normally or force).
		connected = false;
	});

	pdf.savePDFfromHTML(source, destination, options, function (code, file) {
		if(code == 0){ // Convert HTML 2 PDF and save to disk successfully.
			if (connected) { // If user still connected.
				res.header('content-type', 'application/pdf'); // Set header so browser can display it as pdf.
				// res.setHeader('Content-disposition', 'attachment; filename=' + 'demo.pdf');
				var stream = fs.createReadStream(file); // Create stream for user to download.
				stream.on('error', function () { // If Error delete the file in temporary folder.
					fs.unlink(file);
				});
				stream.on('close', function () { // If stream close delete the file in temporary folder (Success to download...).
					fs.unlink(file);
				});
				stream.pipe(res);
			} else { // If user disconnected when the file is being converted.
				fs.unlink(file); // Delete the file without sending down to the user.
			}
		} else{ // Something wrong with HTML 2 PDF convert process.
			res.render('pages/generic_error', { Title:"Maintenance", Code: "500", Detail: "Sorry the download feature is under maintenance<br/ > please try again later. "}); // Return maintenance page.
		}
	});
});

module.exports = router;
