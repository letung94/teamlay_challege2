var spawn = require('child_process').spawn;
var path = require('path');
var pdfExecutable = 'wkhtmltopdf';
if (process.platform === 'win32') {
    pdfExecutable = 'wkhtmltopdf.exe';
}
if (process.platform !== 'darwin') {
    pdfExecutable = path.resolve(path.join('bin', pdfExecutable));
}
var savePDFfromHTML = function (source, destination, options, cb) {
    /*Valid format is A0,A1,A2,A3,A4,A5,Letter*/
    if(!options.format ||  !(options.format == 'A4' || options.format == 'A1' || options.format == 'A2' || options.format == 'A3' || options.format == 'A0' || options.format == 'A5' || options.format.toLowerCase() == 'letter')){
        options.format = 'A4';
    }
    /*Valid orientation is portrait or landscape*/
    if(!options.orientation ||  !(options.orientation.toLowerCase() == 'portrait' || options.orientation.toLowerCase() == 'landscape')){
        options.orientation = 'portrait';
    }
    /*valid zoom is between 1 to 10*/
    if(!options.zoom ||  options.zoom < 1 || options.zoom > 10 ){
        options.zoom = 1;
    }
    /*Margin is between 1mm and 50mm.*/
    if(!options.marginTop || options.marginTop < 0 || options.marginTop > 50){
        options.marginTop = 2;
    }
    if(!options.marginRight ||options.marginRight < 0 || options.marginRight > 50){
        options.marginRight = 2;
    }
    if(!options.marginBottom ||options.marginBottom < 0 || options.marginBottom > 50){
        options.marginBottom = 2;
    }
    if(!options.marginLeft ||options.marginLeft < 0 || options.marginLeft > 50){
        options.marginLeft = 2;
    }
    options.marginTop = options.marginTop + 'mm';
    options.marginRight = options.marginRight + 'mm';
    options.marginBottom = options.marginBottom + 'mm';
    options.marginLeft = options.marginLeft + 'mm';

    var execOptions = [
        '-s', options.format || 'A4', // A0 A1 A2 A3 A4 Letter
        '-L', options.marginLeft || '2mm',
        '-B', options.marginBottom || '2mm',
        '-T', options.marginTop || '2mm',
        '-R', options.marginRight || '2mm',
        '-O', options.orientation || 'portrait',  // Landscape or Portrait
        '--zoom', options.zoom || '1', // > 0
        '--encoding', 'utf-8',
        source,
        destination,
    ];
    var pdfProcess = spawn(pdfExecutable, execOptions);
    pdfProcess.on('error', function (err) {
        // console.log('spawn error:', err);
        pdfProcess.kill();
        cb(-1, err);
    });
    pdfProcess.on('close', function (code) {
        cb(code, destination);
    });

}

module.exports.savePDFfromHTML = savePDFfromHTML;
