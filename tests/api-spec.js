
describe('ngRest - $api Test', function() {

    beforeEach(module('ngRest.$api'));

    var $api;

    beforeEach(inject(function($injector) {

        $api = $injector.get('$api');

    }));

    it('should be object type', function() {
        expect(typeof $api).toEqual('object');
    });

    it('should getBaseURI() return value is string type', function() {
        expect(typeof $api.getBaseURI()).toEqual('string');
    });

    it('should setBaseURI() return value is $api', function() {
        expect($api.setBaseURI()).toEqual($api);
    });

    it('should registerEndpoint() return value is $api', function() {
        expect($api.registerEndpoint()).toEqual($api);
    });

});
