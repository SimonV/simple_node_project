var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var productSchema = new Schema({
    price: Number,
    shipping: Number,
    sku: String,
    title: String,
    brand: String,
    store_id: {type: Schema.Types.ObjectId, ref: 'Store'}
});

module.exports = mongoose.model('Product', productSchema);