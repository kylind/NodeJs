var exec = require('child_process').exec;
var querystring = require('querystring');
var fs = require('fs');
var formidable = require("formidable");


var handle = {
    "/error": function(response, request) {
        response.writeHead(200, {
            'content-type': 'text/plain'
        });
        response.write('Hello error');
        response.end();

    },
    "/": function(response, request) {
        response.writeHead(200, {
            'content-type': 'text/plain'
        });
        response.write('I am home');
        response.end();

    },
    "/start": function(response, request) {
        exec("ls -lah", function(error, stdout, stderr) {
                response.writeHead(200, {
                    'content-type': 'text/plain'
                });
                response.write('Hello Start --- ' + stdout);
                response.end();
            }


        )
    },

    "/fillform": function(response, request) {

        var form = '<html>' +
            '<head>' +
            '<meta http-equiv="Content-Type" content="text/html; ' +
            'charset=UTF-8" />' +
            '</head>' +
            '<body>' +
            '<form action="/upload" method="post"  enctype="multipart/form-data">' +
            '<textarea name="text" id="textId" rows="20" cols="60"></textarea>' +
            '<input type="file" name="upload">' +
            '<input type="submit" value="Submit text111" />' +
            '</form>' +
            '</body>' +
            '</html>';

        response.writeHead(200, {
            'content-type': 'text/html'

        });
        response.write(form);
        response.end();


    },

    '/upload': function(response, request) {

        /*        var postData = querystring.parse(postData);


        response.writeHead(200, {
            'content-type': 'text/plain'
        });
        response.write(postData.text);
        response.end();*/

        var form = new formidable.IncomingForm();

        form.parse(request, function(error, fields, files) {
            console.log(files.upload.path);
            fs.renameSync(files.upload.path, '/tmp/jane.png');
            response.writeHead(200, {
                "Content-Type": "text/html"
            });
            response.write("received image:<br/>");
            response.write("<img src='/showimage' />");
            response.end();


        });

    },

    '/showimage': function(response, request) {

        fs.readFile('/tmp/jane.png', function(error, file) {
            if (error) {
                response.writeHead(500, {
                    'Content-Type': 'text/html'
                });
                response.write('server is down');
                response.end();

            } else {
                response.writeHead(200, {
                    'Content-Type': 'image/png'
                });
                response.write(file, 'binary');
                response.end();
            }
        });

    }

}


exports.handle = handle;