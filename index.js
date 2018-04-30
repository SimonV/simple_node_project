//var bodyParser  = require('body-parser');
var express = require('express');
var http = require('http');

var summary_controller = require('./controllers/summary_controller')
var product_controller = require('./controllers/product_controller')
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/store_db')

//app.use(bodyParser.urlencoded({ extended: true }));

// process.on('uncaughtException', function(err) {
//     console.log('Caught exception: ' + err);
//   });

app.get('/summary', async function(req, res) {
    var summary = await summary_controller.generateSummary();
    return res.json(summary);
});

app.post('/findProducts', async function(req, res){
    var prodcuts = await product_controller.findProducts(req.body);
    return res.json(prodcuts);
})

app.all('*', function(req, res){
    console.log('Unsupported route: ' + req.path);
    res.status(404);
    res.send();
});

http.createServer(app).listen(9001);