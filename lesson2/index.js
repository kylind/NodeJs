var Express = require('express');
var util = require('utility');

var express = new Express();
express.get('/', function(request, response) {
    var q = request.query.q;
    response.send(util.md5(q));
})
express.listen(3002, function() {
    console.log('listen start at 3002');
})