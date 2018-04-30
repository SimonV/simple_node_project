var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

var expect = require('chai').expect;

var sinon = require('sinon');
var mongoose = require('mongoose');
require('sinon-mongoose');


var controller = require('../controllers/product_controller');
var ProductModel = require('../models/product_model');


describe("Products", async function() {
    var Product = mongoose.model('Product');
    var ProductMock;

    beforeEach(() => {
        ProductMock = sinon.mock(Product);
    });

    afterEach(() => {
        ProductMock.verify();
        ProductMock.restore();
    });

    const PRODUCTS = [
        { title: "product1", store_id: '5ae4d4d054b7531004797c56', price: 3},
        { title: "product3", store_id: '5ae4d4d054b7531004797c56', price: 5},
        { title: "product5", store_id: '5ae4d4d054b7531004797c56', price: 7},
        { title: "product2", store_id: '5ae4d4d054b7531004797c58', price: 4},
        { title: "product4", store_id: '5ae4d4d054b7531004797c58', price: 6}
    ];

    it("should validate filter parameters", async() => {
        // var parameters = {filter: [{'title':'product1'}]};
        // try {
        //     var product_list = await product_controller.findProducts(parameters);
        // } catch (error) {
            
        // }
        // var product_list = await product_controller.findProducts(parameters);
        // expect.
        // expect.fail("","","Missing test");

        // var parameters = {filter: []};
        // var product_list = await product_controller.findProducts(parameters);
        expect.fail("","","Missing test");
    });

    it("should validate sort parameters", async() => {
        expect.fail("","","Missing test");    
    });

    it("should validate limit parameter", async() => {
        
        expect(controller.findProducts({limit: "string"}))
            .to.be.rejectedWith(TypeError);

        expect(controller.findProducts({limit: -10}))
            .to.be.rejectedWith(TypeError);
       
        ProductMock.expects('find')
            .chain('limit').withArgs(10)
            .chain('exec')
            .resolves(PRODUCTS);

        var products = await controller.findProducts({limit: 10});
        expect(products).to.be.a("Array");
        expect(products.length).to.eq(PRODUCTS.length);
    });

    it("should return valid response without products", async() => {
        expect.fail("","","Missing test");
    });

    it("should return valid response", async() => {
        expect.fail("","","Missing test");
    });
});