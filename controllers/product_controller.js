//var Store = require('../models/store_model')
var Product = require('../models/product_model')

const SORT_DESC = -1;
const SORT_ASC = 1;

const validate_limit = (limit) => {
    return Number.isInteger(limit) && limit > 0;
}

var controller = {

    findProducts: async function(parameters){
        //console.log('Looking for products matching:' , parameters);

        var query = Product;
        var find_clause = {};
        var sort_clause = {};
        var limit_clause = null;
        
        //Validate parameter values
        query = query.find({});
        // if (parameters.hasOwnProperty('filter')){
        //     if (validate_filter(parameters.filter)){
        //         find_clause = build_find_clause(parameters.filter);
        //     }else{
        //         throw new TypeError('Failed to parse filter field');
        //     }
        // }

        query = query.sort({'price': SORT_ASC});
        // if (parameters.hasOwnProperty('sort')){
        //     if (validate_sort(parameters.sort)){
        //         sort_clause = build_find_clause(parameters.sort);
        //     }else{
        //         throw new TypeError('Failed to parse sort field');
        //     }
        // }

        query = query.limit(10);
        if (parameters.hasOwnProperty('limit')){
            if (validate_limit(parameters.limit)){
                query = query.limit(parameters.limit);
            }else{
                throw new TypeError('Invalid limit field value');
            }
        }

        //Build Query
        //var products = await Product.find(find_clause).sort({'price': SORT_ASC}).limit(10);
        var products = await query.exec();
        return products;

    }
}

module.exports = controller;