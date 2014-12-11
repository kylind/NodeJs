var http = require('http');
var url = require('url');

function start(router, handle) {

    http.createServer(function(request, response) {

        console.log('...response start...');
        var pathName = url.parse(request.url).pathname;
        console.log('request path: ' + pathName);

        /*        var postData = '';

        request.addListener('data', function(dataChunk) {
            postData += dataChunk;

        });

        request.addListener('end', function() {
            router.route(pathName, handle, response, postData);

        });*/

        router.route(pathName, handle, response, request);



    }).listen(8888);

    console.log("server start...");

}

exports.start = start;