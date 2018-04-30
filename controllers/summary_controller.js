var Store = require('../models/store_model')
var Product = require('../models/product_model')

const summariser = (accumulator, currentValue) => {
     
    if (accumulator['min_price'] > currentValue['price']){
        accumulator['min_price'] = currentValue['price'];
    }

    if (accumulator['max_price'] < currentValue['price']){
        accumulator['max_price'] = currentValue['price'];
    }

    var old_total_price = accumulator['avg_price'] * accumulator['count'];
    accumulator['avg_price'] = (old_total_price + currentValue['price']) / (accumulator['count'] + 1);

    accumulator['count']++;

    return accumulator;
};


const store_summariser = async (currentValue) => {
    
    var products =  await Product.find({store_id: currentValue['_id']});
    var store_summary = products.reduce(summariser, { 
            name: currentValue['name'],
            count: 0, 
            min_price: Number.MAX_SAFE_INTEGER, 
            max_price: Number.MIN_SAFE_INTEGER, 
            avg_price: 0 
        });

    if (store_summary['count'] === 0){
        store_summary['min_price'] = 0;
        store_summary['max_price'] = 0;
    }

    return store_summary;   
}

var controller = {
    generateSummary: async function(){
        //console.log('Generating summary');

        var stores = await Store.find({});
        return await Promise.all(stores.map(store_summariser));
    }
}

module.exports = controller;