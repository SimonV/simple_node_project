var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var storeSchema = new Schema({
    name: String,
    url: String
});

module.exports = mongoose.model('Store', storeSchema);