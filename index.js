var bodyParser  = require('body-parser');
var express = require('express');
var http = require('http');

var summary_controller = require('./controllers/summary_controller')
var product_controller = require('./controllers/product_controller')
var app = express();

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/store_db')

app.use(bodyParser.json({ extended: true }));

// process.on('uncaughtException', function(err) {
//     console.log('Caught exception: ' + err);
//   });

app.get('/summary', async function(req, res) {
    try {
        var summary = await summary_controller.generateSummary();
        return res.json(summary);   
    } catch (error) {
        //check error type
        console.log(error);
        res.status(500);
        res.send('Internal error');
    }
});

app.post('/findProducts', async function(req, res){
    try {
        var prodcuts = await product_controller.findProducts(req.body);
        return res.json(prodcuts);
    } catch(error){
        if (error instanceof TypeError){
            console.log(error);
            res.status(400);
            res.send('Invalid request');      
        }else{
            //check error type
            console.log(error);
            res.status(500);
            res.send('Internal error');
        }
    }
})

app.all('*', function(req, res){
    console.log('Unsupported route: ' + req.path);
    res.status(404);
    res.send();
});

http.createServer(app).listen(9001);