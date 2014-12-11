var Express = require('express');
var express = new Express();
express.get('/', function(request, response) {
    response.send('hello world');

});
express.listen(3001, function() {
    console.log('listen start...');
});