var fs = require('fs');
var path = require('path');

var toDoFolder = process.argv[2];
var rsFile = process.argv[3];


var fileList = fetchPageFiles(toDoFolder);
fileList.forEach(function(val) {

    var data = fs.readFileSync(val, {
        encoding: 'utf8'
    });
    data = "<div>  i am div</div>";
    var regex = new RegExp('>([;,.\\w\\t\\d]+)(?=</\\w+>)', 'igm');
    var matched=regex.exec(data);
    console.log(RegExp.$1);

    var rsData = data.replace(RegExp.$1, 'fuck'); //RegExp.$1+    (?=<\/\w+>)

    //data=data + "-----------------------------------\n\r";

    fs.appendFileSync(rsFile, rsData)
});


function parseData() {

}


function fetchPageFiles(dir) {
    dir = path.resolve(dir);
    var fileList = [];
    var files = fs.readdirSync(dir);
    files.forEach(function(val) {
        var filePath = dir + "/" + val;

        var stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            var filesInDir = fetchPageFiles(filePath);
            fileList = fileList.concat(filesInDir);

        } else {
            var extname = path.extname(filePath);
            if (extname == ".page" || extname == ".nopage") {
                fileList.push(filePath);
            }
        }

    })
    return fileList
}
