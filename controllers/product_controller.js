var Store = require('../models/store_model')
var Product = require('../models/product_model')



var controller = {

    findProducts: function(parameters){
        console.log('Looking for products matching:' + parameters);
        return {};
    }
}

module.exports = controller;