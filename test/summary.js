var expect = require('chai').expect;

var sinon = require('sinon');
var mongoose = require('mongoose');
require('sinon-mongoose');


var controller = require('../controllers/summary_controller');
var StoreModel = require('../models/store_model');
var ProductModel = require('../models/product_model');


describe("Summary", function() {

    var Store = mongoose.model('Store');
    var StoreMock = sinon.mock(Store);
  
    var Product = mongoose.model('Product');
    var ProductMock = sinon.mock(Product);

    it("should return valid summary with no available data", async () => {

        StoreMock.expects('find').resolves([]);

        var summary = await controller.generateSummary();
        expect(summary).to.be.a("Array");
        expect(Object.keys(summary).length).equal(0);   
    });

    it("should calculate product count", async () => {

        StoreMock.expects('find').resolves([
            { _id: '5ae4d4d054b7531004797c56', name: 'TestStore1', url: ''},
            { _id: '5ae4d4d054b7531004797c58', name: 'TestStore2', url: ''},
        ]);

        ProductMock.expects('find').withArgs({store_id: '5ae4d4d054b7531004797c56'}).resolves([
            { title: "product1", store_id: '5ae4d4d054b7531004797c56', price: 3},
            { title: "product3", store_id: '5ae4d4d054b7531004797c56', price: 5},
            { title: "product5", store_id: '5ae4d4d054b7531004797c56', price: 7}
        ]);

        ProductMock.expects('find').withArgs({store_id: '5ae4d4d054b7531004797c58'}).resolves([
            { title: "product2", store_id: '5ae4d4d054b7531004797c58', price: 4},
            { title: "product4", store_id: '5ae4d4d054b7531004797c58', price: 6}
        ]);

        var summary = await controller.generateSummary();

        expect(summary).to.be.a("Array");
        expect(Object.keys(summary).length).equal(2);  
    });
});