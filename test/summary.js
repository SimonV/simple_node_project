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

    // it("should return valid summary with no available data", function(done) {
    //     return controller.generateSummary()
    //     .then(function(summary){
    //         expect(summary).to.be.a("String");
    //         expect(Object.keys(summary).length).equal(0);
    //         done();
    //     }).catch((err)=>{
    //         done(err);
    //     })
    // });

    it("should calculate product count", (done) => {
        ProductMock.expects('find').resolves([
            { title: "product1", store_id: '5ae4d4d054b7531004797c56', price: 3},
            { title: "product2", store_id: '5ae4d4d054b7531004797c58', price: 4},
            { title: "product3", store_id: '5ae4d4d054b7531004797c56', price: 5},
            { title: "product4", store_id: '5ae4d4d054b7531004797c58', price: 6},
            { title: "product5", store_id: '5ae4d4d054b7531004797c56', price: 7}
        ]);

        StoreMock.expects('find').resolves([
            { _id: '5ae4d4d054b7531004797c56', name: 'TestStore1', url: ''},
            { _id: '5ae4d4d054b7531004797c58', name: 'TestStore2', url: ''},
        ]);

        return controller.generateSummary()
        .then((summary)=>{
            expect(summary).to.be.a("String");
            expect(Object.keys(summary).length).equal(0);
            console.log(summary);
            done();
        }).catch((err)=>{
            done(err);
        });
    });
});