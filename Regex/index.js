var fs = require('fs');
var path=require('path');


var toDoFolder=process.argv[2];
var rsFile=process.argv[3];

function fetchPageFiles(dir){
    var files=fs.readdirSync(path);
    files.forEach(function(val){

    })

}


fs.readFile(toDoFolder, function(err, data) {
    if (err) throw err;
    fs.writeFile('target-ok.page', data, function(err) {
        if (err) throw err;
        console.log('has finished');
    })

})
