var expect = require('chai').expect;
var controller = require('../controller');

describe("Summary", function(){

    it("should return valid summary with no available data",function(){
        var summary = controller.generateSummary();
        expect(summary).to.be.a("Object");
        expect(Object.keys(summary).length).equal(0);
    });

});