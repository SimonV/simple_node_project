//var Store = require('../models/store_model')
var Product = require('../models/product_model')

const SORT_DESC = -1;
const SORT_ASC = 1;

const build_filter_clause = (filter) => {
    var result = true;
    Object.keys(filter).forEach(key => {
        if (!Product.schema.obj.hasOwnProperty(key)) {
            throw new TypeError('Unsupported filter field: ' + key);
        }
        if (typeof(filter[key]) != Product.schema.obj[key].name.toLowerCase()){
            throw new TypeError('Invalid filter field value type for field: ' + key);
        }
    })
    return filter;
}

const build_sort_clause = (sort) => {
    if (Object.keys(sort).length != 1){
        throw new TypeError('Only sorting by a single field is supported');
    }
    var key = Object.keys(sort)[0];

    if (!Product.schema.obj.hasOwnProperty(key)){
        throw new TypeError('Invalid sort field name: '+ key);
    }

    if (sort[key].toLowerCase() == "asc"){
        sort[key] = SORT_ASC;
    }else if (sort[key].toLowerCase() == "desc"){
        sort[key] = SORT_DESC;
    }else{
        throw new TypeError('Unsupported sort field value: '+ sort[key]);
    }
    return sort;
}

const build_limit = (limit) => {
    if (!Number.isInteger(limit)){
        throw new TypeError('Unsupported limit field value: '+ limit);
    }
    if (limit < 1){
        throw new TypeError('Limit field value can not be negative');
    }
    return limit;
}

var controller = {
    findProducts: async function(parameters){
        var query = Product;
        
        var filter_clause = {};
        var sort_clause = {};

        //Validate parameter values
        if (parameters.hasOwnProperty('filter')){
            query = query.find(build_filter_clause(parameters.filter));
        }else{
            query = query.find({});
        }

        if (parameters.hasOwnProperty('sort')){
            query = query.sort(build_sort_clause(parameters.sort));
        }

        if (parameters.hasOwnProperty('limit')){
            query = query.limit(build_limit(parameters.limit));
        }

        var products = await query.exec();
        return products;
    }
}

module.exports = controller;