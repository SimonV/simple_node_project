var id = require('pow-mongodb-fixtures').createObjectId;

var stores = {
    store1: { _id: id(), name: "ACME", url: "http://www.acme.com/" },
    store2: { _id: id(), name: "Buy n Large", url: "http://pixar.wikia.com/wiki/Buy_n_Large" },
    store3: { _id: id(), name: "Mann Co.", url: "https://wiki.teamfortress.com/wiki/Mann_Co." },
    store4: { _id: id(), name: "The Leaky Cauldron", url: null },
}
console.log("stores: " + stores['store1' ]._id);

var products = [];

for (i = 0; i < 50; i++ ){
    var random_price = Math.floor((Math.random() * 200) + 10);
    console.log("store:" + stores['store' + ((i % 4) + 1)]._id);
    products.push({ title: "product" + i, store_id: stores['store' + ((i % 4) + 1) ]._id, price: random_price})
}

exports.stores = stores;
exports.products = products;

// {
//     price: Number,
//     shipping: Number,
//     sku: String,
//     title: String,
//     brand: String,
//     store_id: {type: Schema.Types.ObjectId, ref: 'Store'}
// }