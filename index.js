//var bodyParser  = require('body-parser');
var express = require('express');
var http = require('http');

var summary_controller = require('./controllers/summary_controller')
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/store_db')

//app.use(bodyParser.urlencoded({ extended: true }));

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
  });

app.get('/summary', function(req, res) {
    summary_controller.generateSummary()
        .then( summary => res.json(summary))
});

app.post('/findProducts', function(req, res){
    controller.findProducts(req.body)
        .then( products => res.json(products));
})

app.all('*', function(req, res){
    console.log('Unsupported route: ' + req.path);
    res.status(404);
    res.send();
});

http.createServer(app).listen(9001);