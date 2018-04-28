//var bodyParser  = require('body-parser');
var express = require('express');
var http = require('http');

var controller = require('./controller')
var app = express();

//app.use(bodyParser.urlencoded({ extended: true }));

app.get('/summary', function(req, res){
    res.send(controller.generateSummary());
});

app.post('/findProducts', function(req, res){
    res.send(controller.findProducts(req.body));
})

app.all('*', function(req, res){
    console.log('Unsupported route: ' + req.path);
    res.status(404);
    res.send();
});

http.createServer(app).listen(9001);