var spawn = require('child_process').spawn;
var path = require('path');
var pdfExecutable = 'phantomjs';
if (process.platform === 'win32') {
    pdfExecutable = 'wkhtmltopdf.exe';
}
if (process.platform !== 'darwin') {
    pdfExecutable = path.resolve(path.join('bin', pdfExecutable));
}
var savePDFfromHTML = function (source, destination, options, cb) {
    var execOptions = [
        '-s', options.format || 'A4', // A0 A1 A2 A3 A4 Letter
        '-L', options.leftMargin || '2mm',
        '-R', options.rightMargin || '2mm',
        '-B', options.bottomMargin || '2mm',
        '-T', options.topMargin || '2mm',
        '-O', options.orientation || 'portrait',  // Landscape or Portrait
        '--zoom', options.zoom || '1', // > 0
        source,
        destination,
    ]
    var pdfProcess = spawn(pdfExecutable, execOptions);
    // pdfProcess.stdout.on('data', function (data) {
    //     console.log('pdf out: ' + data);
    // });
    pdfProcess.stderr.on('data', function (data) {
        console.error('pdf err: ' + data);
    });
    pdfProcess.on('close', function (code) {
        // console.log(code);
        cb(code, destination);
    });
}

module.exports.savePDFfromHTML = savePDFfromHTML;