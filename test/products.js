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
        { title: "product1", brand: "br1", sku:"pcs", store_id: '5ae4d4d054b7531004797c56', price: 3, shipping: 1, },
        { title: "product3", brand: "br1", sku:"pcs", store_id: '5ae4d4d054b7531004797c56', price: 5, shipping: 1, },
        { title: "product5", brand: "br2", sku:"pcs", store_id: '5ae4d4d054b7531004797c56', price: 7, shipping: 1, },
        { title: "product2", brand: "br2", sku:"pcs", store_id: '5ae4d4d054b7531004797c58', price: 4, shipping: 1, },
        { title: "product4", brand: "br3", sku:"pcs", store_id: '5ae4d4d054b7531004797c58', price: 6, shipping: 1, }
    ];

    it("should validate filter parameters", async() => {

        expect(controller.findProducts({filter: {title: 1111 }}))
            .to.be.rejectedWith(TypeError);

        expect(controller.findProducts({filter: {title: "1111", sku: 4 }}))
            .to.be.rejectedWith(TypeError);

        expect(controller.findProducts({filter: {title: "1111", sku: "pcs", price: "asd" }}))
            .to.be.rejectedWith(TypeError);


        ProductMock.expects('find')
            .withArgs( {title: "1111", sku: "pcs", price: 3 } )
            .chain('exec')
            .resolves(PRODUCTS);

        var products = await controller.findProducts({filter: {title: "1111", sku: "pcs", price: 3 }});

        expect(products).to.be.a("Array");
        expect(products.length).equal(PRODUCTS.length); 
    });

    it("should validate sort parameters", async() => {
        expect(controller.findProducts({sort: {title: "desc", brand: "asc" }}))
            .to.be.rejectedWith(TypeError);  

        expect(controller.findProducts({sort: {fake_field: "desc" }}))
            .to.be.rejectedWith(TypeError);  

        expect(controller.findProducts({sort: {title: 1111 }}))
            .to.be.rejectedWith(TypeError);

        ProductMock.expects('find')
            .chain('sort').withArgs({price: -1})
            .chain('exec')
            .resolves(PRODUCTS);

        var products = await controller.findProducts({sort: {price: "desc"}});

        expect(products).to.be.a("Array");
        expect(products.length).equal(PRODUCTS.length);    
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
        ProductMock.expects('find')
            .chain('exec')
            .resolves([]);

        var products = await controller.findProducts({});
        expect(products).to.be.a("Array");
        expect(products.length).to.eq(0);
    });

    it("should return valid response", async() => {
        ProductMock.expects('find').withArgs({title: "1111", sku: "pcs", price: 3 })
            .chain('sort').withArgs({price: -1})
            .chain('limit').withArgs(10)
            .chain('exec')
            .resolves(PRODUCTS);

        var query = { 
            filter:{ title: "1111", sku: "pcs", price: 3 }, 
            sort: {price: "desc"}, 
            limit: 10 
        };

        var products = await controller.findProducts(query);
            expect(products).to.be.a("Array");
            expect(products.length).to.eq(PRODUCTS.length);
    });
});