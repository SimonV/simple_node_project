var expect = require('chai').expect;

var sinon = require('sinon');
var mongoose = require('mongoose');
require('sinon-mongoose');


var controller = require('../controllers/summary_controller');
var StoreModel = require('../models/store_model');
var ProductModel = require('../models/product_model');


describe("Summary", function() {

    var Store = mongoose.model('Store');
    var Product = mongoose.model('Product');

    var ProductMock;
    var StoreMock;

    beforeEach(() => {
        StoreMock = sinon.mock(Store);
        ProductMock = sinon.mock(Product);
    });

    afterEach(() => {
        StoreMock.verify();
        StoreMock.restore();
        
        ProductMock.verify();
        ProductMock.restore();
    });

    const STORES = [
        { _id: '5ae4d4d054b7531004797c56', name: 'TestStore1', url: ''},
        { _id: '5ae4d4d054b7531004797c58', name: 'TestStore2', url: ''},
    ];

    const PRODUCTS = [
        { title: "product1", brand: "br1", sku:"pcs", store_id: '5ae4d4d054b7531004797c56', price: 3, shipping: 1, },
        { title: "product3", brand: "br1", sku:"pcs", store_id: '5ae4d4d054b7531004797c56', price: 5, shipping: 1, },
        { title: "product5", brand: "br2", sku:"pcs", store_id: '5ae4d4d054b7531004797c56', price: 7, shipping: 1, },
        { title: "product2", brand: "br2", sku:"pcs", store_id: '5ae4d4d054b7531004797c58', price: 4, shipping: 1, },
        { title: "product4", brand: "br3", sku:"pcs", store_id: '5ae4d4d054b7531004797c58', price: 6, shipping: 1, }
    ];

    it("should return valid empty summary with no available stores", async () => {

        StoreMock.expects('find').resolves([]);

        var summary = await controller.generateSummary();
        expect(summary).to.be.a("Array");
        expect(Object.keys(summary).length).equal(0);   
    });

    it("should return valid summary of a single store without products", async () => {
        
        StoreMock.expects('find').resolves([STORES[0]]);

        ProductMock.expects('find')
            .withArgs( { store_id: STORES[0]['_id'] } )
            .resolves([]);

        var summary = await controller.generateSummary();
        expect(summary).to.be.a("Array");
        expect(Object.keys(summary).length).equal(1); 

        var store = summary[0];
        expect(store.name).equal(STORES[0].name);
        expect(store.count).equal(0); 
        expect(store.avg_price).equal(0); 
        expect(store.max_price).equal(0); 
        expect(store.min_price).equal(0);  
    });

    it("should return valid summary of multiple stores without products", async () => {
        // Overlapping with single store test but was somewhat useful at least once
        StoreMock.expects('find').resolves(STORES);

        STORES.forEach(store => {
            ProductMock.expects('find')
                .withArgs( { store_id: store['_id'] } )
                .resolves([]);
        });

        var summary = await controller.generateSummary();
        expect(summary).to.be.a("Array");
        expect(Object.keys(summary).length).equal(STORES.length); 

        summary.forEach(store => {
            expect(store.count).equal(0); 
            expect(store.avg_price).equal(0); 
            expect(store.max_price).equal(0); 
            expect(store.min_price).equal(0); 
        });        
    });

    it("should contain in summary each store once", async () => {
        StoreMock.expects('find').resolves(STORES);

        STORES.forEach(store => {
            ProductMock.expects('find')
                .withArgs( { store_id: store['_id'] } )
                .resolves( PRODUCTS.filter(item => item.store_id === store['_id'] ));
        });

        var names = STORES.reduce((map, store) => {
            map[store.name] = true;
            return map;
        },{});

        var summary = await controller.generateSummary();
        expect(Object.keys(summary).length).equal(STORES.length);

        summary.forEach(store => { delete names[store.name]; });
        expect(Object.keys(names).length).equal(0);

    });

    it("should calculate product stats correctly", async () => {
        var store_stats = {};

        StoreMock.expects('find').resolves(STORES);

        STORES.forEach(store => {
            var store_products =  PRODUCTS.filter(item => item.store_id === store['_id']);

            ProductMock.expects('find')
                .withArgs( { store_id: store['_id'] } )
                .resolves( store_products );

            var stats = {};

            stats['count'] = store_products.length;
            stats['min_price'] = Math.min(...store_products.map(item => item.price));
            stats['max_price'] = Math.max(...store_products.map(item => item.price));
            var sum = store_products.reduce((acc, item) => acc + item.price, 0) ;
            stats['avg_price'] = sum / store_products.length;

            store_stats[store.name] = stats;
        });

        var summary = await controller.generateSummary();

        summary.forEach(store => {
            var expected_stats = store_stats[store.name];
            expect(store.count).equal(expected_stats.count); 
            expect(store.avg_price).equal(expected_stats.avg_price); 
            expect(store.max_price).equal(expected_stats.max_price); 
            expect(store.min_price).equal(expected_stats.min_price); 
        });     
    });
});