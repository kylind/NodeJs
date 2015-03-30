var fs = require('fs');
var path = require('path');

var toDoFolder = process.argv[2];
var rsFile = process.argv[3];


var fileList = fetchPageFiles(toDoFolder);
var regexs = []
//var regex1 = new RegExp(">(\\s*[\\w&#]+[\\w ,.!:'&#;\\*\\?\"]{2,})</\\w+>", 'igm'); //<div>abc</div>
var regex1 = new RegExp(">[\\s,\"#:.]*([^><\\}\\{%/\\=]+\\w+)[\\s,\"#:.!\\?\\+]*<[/]?(?!script)", 'igm'); //<div>abc</div> google+
//var regex2 = new RegExp(">\\s*([^\\s><\\}\\{%]+[^><\\}\\{%]{2,})\\s*\\{[\\{%]", 'igm'); //<div>abc {{ abc }} | <div>abc {% abc %}
//var regex3 = new RegExp("[%\\}]\\}\\s*([^\\s><\\}\\{%]+[^><\\}\\{%]{2,})\\s*</\\w+>", 'igm'); //{{ abc }}abc</div> | {% abc %}abc</div>
//var regex4 = new RegExp("[%\\}]\\}\\s*([^\\s><\\}\\{%]+[^><\\}\\{%\\=]{2,})\\s*\\{[\\{%]", 'igm'); //{{ abc }}abc{{ abc }}
//var regex5 = new RegExp(">\\s*([\\w&#]+[\\s\\w ,.!:'&#;\\*\\?\"]{2,})</p>", 'igm'); //<p>sdsf</p>(multiple line p element)

regexs.push(regex1);
/*regexs.push(regex2);
regexs.push(regex3);
regexs.push(regex4);
//regexs.push(regex5);*/
var allVariableDeclaim="";
fileList.forEach(function(val) {
    var newFilename = path.dirname(val) + "/" + path.basename(val, path.extname(val)) + ".newpage";
    //var newFilename = val;
    if (fs.existsSync(newFilename)) {
        fs.unlinkSync(newFilename);
    }

    var data = fs.readFileSync(val, {
        encoding: 'utf8'
    });

    if (data.trim() == "") {
        return;
    }

    var rs = parseData(data,allVariableDeclaim);

    allVariableDeclaim=rs.allVariableDeclaim;

    fs.appendFileSync(rsFile, "{# ------------ " + path.basename(val) + " ------------ #}\n" + rs.variableDeclaim);

    fs.writeFileSync(newFilename, rs.newData);

});


function parseData(data,allVariableDeclaim) {

    var text = "";
    var variable = "";
    var variableDeclaim = "";
    var variableOutput = "";

    var newData = data;
    regexs.forEach(function(regex) {

        do {
            var matched = regex.exec(data);
            if (matched) {

                text = matched[1].trim();
                variable = text.substring(0, 50).replace(/[^0-9a-zA-Z]/g, '_');


/*                if (allVariableDeclaim.search(new RegExp("/Start/ " + text + " /End/", "im")) == -1) {
                    variableDeclaim = variableDeclaim + "/Name/ " + variable + " = '' /Start/ " + text + " /End/\n\n";
                    allVariableDeclaim = allVariableDeclaim.concat(variableDeclaim);
                }
*/

                //if (allVariableDeclaim.search(new RegExp("{# " + text + " #}","im"))==-1) {
                if (allVariableDeclaim.indexOf("{# " + text + " #}")==-1) {

                    variableDeclaim = variableDeclaim + "{% set " + variable + ' = "'+text.replace(/"/g,'\\"')+'" %}{# ' + text + ' #}\n\n';
                    allVariableDeclaim=allVariableDeclaim.concat(variableDeclaim);
                }

                variableOutput = matched[0].replace(text, "{{ " + variable + " }}")
                newData = newData.replace(matched[0], variableOutput);
            }

        } while (matched != null)

    });

    return {
        newData: newData,
        variableDeclaim: variableDeclaim,
        allVariableDeclaim: allVariableDeclaim
    };

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
            var basename=path.basename(filePath, path.extname(filePath))
            if (extname == ".page" || extname == ".nopage" || (extname == ".tpt" && basename !="debugBar")) {
                fileList.push(filePath);
            }
        }

    })
    return fileList
}
