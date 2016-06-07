var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var helper = require('../helper/helper');
var pdf = require('../helper/pdf');
var di = require('../config/config');
var async = require('async');
var uuid = require('node-uuid');

router.get('/templateReview/:name/:cv_id', function (req, res) {
	var name = req.params.name;
	var cv_id = req.params.cv_id;
	var info = {};
	async.waterfall([
		function(done){
			/*Contact Info*/
			var ContactInfoService = di.resolve('contact_info');
			var contactInfoService = new ContactInfoService();
			contactInfoService.getByIdCV({CV_Id: cv_id}, function(code, data){
				info.contact_info = data;
				done();
			})
		},
		function(done){
			/*Summary*/
			var SummaryService = di.resolve('summary');
			var summaryService = new SummaryService();
			summaryService.getByIdCV({CV_Id: cv_id}, function(code, data){
				info.summary = data;
				done();
			})
		},
		function(done){
			/*Experience*/
			var ExperienceService = di.resolve('experience');
			var experienceService = new ExperienceService();
			experienceService.getAllExperienceByCVId( cv_id, function(code, data){
				info.experiences = data;
				done();
			})
		},
		function(done){
			/*Skill*/
			var SkillService = di.resolve('skill');
			var skillService = new SkillService();
			skillService.getAllSkillByCVId(cv_id, function(code, data){
				info.skills = data;
				done();
			})
		},
		function(done){
			/*Education*/
			var EducationService = di.resolve('education');
			var educationService = new EducationService();
			educationService.getAllByIdCV(cv_id, function(code, data){
				if(code == 1){
					/*Convert DB date to readable date*/
					if(data){
						var length = data.length;
						for (var i = 0; i < length; i++) {
							var education = data[i];
							if(education.FromDate){
								education.FromDate = helper.parseDate(education.FromDate);
							}
							if(education.ToDate){
								education.ToDate = helper.parseDate(education.ToDate);
							}
						}
						info.educations = data;
					}
				}
				done();
			})
		},
		function(done){
			/*Education*/
			var ProjectService = di.resolve('project');
			var projectService = new ProjectService();
			projectService.getAllProjectByCVId({CV_Id: cv_id}, function(code, data){
				if(code == 1){
					/*Convert DB date to readable date*/
					if(data){
						var length = data.length;
						for (var i = 0; i < length; i++) {
							var project = data[i];
							if(project.FromDate){
								project.FromDate = helper.parseDate(project.FromDate);
							}
							if(project.ToDate){
								project.ToDate = helper.parseDate(project.ToDate);
							}
						}
						info.projects = data;
					}else{
						info.projects = [];
					}
				}
				done();
			})
		},
		function(done){
			/*Certificate*/
			var CertificateionService = di.resolve('certification');
			var certificateionService = new CertificateionService();
			certificateionService.getAllCertificationByCVId(cv_id, function(code, data){
				if(code == 1){
					/*Convert DB date to readable date*/
					var length = data.length;
					for (var i = 0; i < length; i++) {
						var certification = data[i];
						if(certification.Date){
							certification.Date = helper.parseDate(certification.Date);
						}
					}
					info.certifications = data;
				}
				done();
			});
		},
		function(done){
			var templatePath = path.join(__dirname + '/../view/templates/' + name);
			fs.exists(templatePath, function (exist) {
				if(exist){
					res.render('templates/' + name, info);
				}else{
					res.render('pages/generic_error', {ExcludeHeader: '1', Title:'CV Template not found',Code: '404',
					Detail: 'The template you given is not exist or under maintenance, please try again later.'});
				}
			});
		},
	], function(err){
		res.render('pages/server_error_505');
	});
});

router.get('/template_list/:cv_id', function (req, res) {
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

router.get('/download/:name/:cv_id', function (req, res) {
	/* Server request to server so we don't have any cookie in here
	* which we have to get current cookie (from client) and send it to pdf helper*/
	var cookie = req.cookies;
	var name = req.params.name; /* Template file name. */
	var cv_id = req.params.cv_id;
	var source =  req.headers.host + '/template/templateReview/' + name + '/' + cv_id; /* Get from template review page. */
	var destination = path.join(__dirname + '/../tmp/', uuid.v1()+ '.pdf'); /* Declare temporarily save folder. */
	var options = {
		cookie: cookie,
		format:req.query.format,
		orientation: req.query.orientation,
		zoom : req.query.zoom,
		marginTop : req.query.marginTop,
		marginRight : req.query.marginRight,
		marginBottom : req.query.marginBottom,
		marginLeft : req.query.marginLeft
	}; /* Options about the pdf that going to be exports. */

	var connected = true; // keep track of user connection.
	req.on("close", function () { /* Fire when user disconnect (normally or force). */
		connected = false;
	});

	pdf.savePDFfromHTML(source, destination, options, function (code, file) {
		if(code == 0){ /* Convert HTML 2 PDF and save to disk successfully. */
			if (connected) { /* If user still connected. */
				res.header('content-type', 'application/pdf'); /* Set header so browser can display it as pdf.*/
				// res.setHeader('Content-disposition', 'attachment; filename=' + 'demo.pdf');
				var stream = fs.createReadStream(file); // Create stream for user to download.
				stream.on('error', function () {  /*Something wrong when streaming.*/

				});
				stream.on('close', function () { /* User success to download. */

				});
				stream.pipe(res);
			} else { /* If user disconnected when the file is being converted. */

			}
		} else{ // Something wrong with HTML 2 PDF convert process.
			res.render('pages/generic_error', { Title:"Maintenance", Code: "500", Detail: "Sorry the download feature is under maintenance<br/ > please try again later. "}); // Return maintenance page.
		}
	});
});

module.exports = router;
