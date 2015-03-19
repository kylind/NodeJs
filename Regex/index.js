var fs = require('fs');
var path = require('path');


var toDoFolder = process.argv[2];
var rsFile = process.argv[3];

console.log(toDoFolder);
console.log(rsFile);
/*var fileList = fetchPageFiles(toDoFolder);*/
/*fileList.forEach(function(val) {

    var data=fs.readFileSync(val);

    data=data + "-----------------------------------\n\r";

    fs.appendFileSync(rsFile,data)

});
*/

function fetchPageFiles(dir) {
    var fileList = [];
    var files = fs.readdirSync(path);
    files.forEach(function(val) {
        var filePath = dir + "/" + val;


        var stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            var filesInDir = fetchPagefiles(filePath);
            fileList.concat(filesInDir);

        } else {
            var extname = path.extname(filePath);
            if (extname == "page" || extname == "nopage") {
                fileList.push(val);
            }
        }

    })
    return fileList
}
