var Store = require('../models/store_model')
var Product = require('../models/product_model')


var controller = {

    findProducts: async function(parameters){
        console.log('Looking for products matching:' , parameters);

        try{
            var products = await Product.find({})
       
            return {};
        }catch(error) {
            console.log("Error while generating summary", error);
            return {};
        }
    }
}

module.exports = controller;