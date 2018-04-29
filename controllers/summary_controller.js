var Store = require('../models/store_model')
var Product = require('../models/product_model')

const summariser = (accumulator, currentValue) => {
    var store = accumulator[currentValue["store_id"]];

    store = store || { count: 0, min_price: Number.MAX_SAFE_INTEGER, max_price: Number.MIN_SAFE_INTEGER, avg_price: 0 };
    
    if (store['min_price'] > currentValue['price']){
        store['min_price'] = currentValue['price'];
    }

    if (store['max_price'] < currentValue['price']){
        store['max_price'] = currentValue['price'];
    }

    var old_total_price = store['avg_price'] * store['count'];
    store['avg_price'] = (old_total_price + currentValue['price']) / (store['count'] + 1);

    store['count']++;

    accumulator[currentValue["store_id"]] = store;
    return accumulator;
};

const get_store_name = async (store_id) => {
    return Store.findById(store_id)
    .then(store => {
        return store['name'];
    })
    .catch(err => {
        console.log(err);
        throw err;
    });
}

var controller = {
    generateSummary: function(){
        console.log('Generating summary');

        var store_summary = {}; 

        return Product.find({}).then( products => {
            return products.reduce(summariser,{});
        }).then( summary => {
            return Promise.all(Object.keys(summary).map(store_id => {
                return get_store_name(store_id).then(store_name => {
                    store_summary[store_name] = summary[store_id];
                });
            }));
        }).then(() => {
            console.log(store_summary);
            return store_summary;
        }).catch(err => {
            console.log("Error while generating summary", err);
            return {};
        });
    }
}

module.exports = controller;