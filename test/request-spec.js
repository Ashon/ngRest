
describe('ngRest.$request', function() {

    var $request;

    beforeEach(module('ngRest.$request'));

    beforeEach(inject(function($injector) {
        $request = $injector.get('$request');
    }));

    it('should be a function', function() {
        expect(typeof $request).toEqual('function');
    });

    it('instance should be a function', function() {
        var instance = $request(null, null, null);
        expect(typeof instance).toEqual('function');
    });

    it('should has "url" and "method"', function() {
        var instance = $request('http://localhost:8080/', 'get');
        expect(instance.prototype.getURL()).toEqual('http://localhost:8080/');
        expect(instance.prototype.getMethod()).toEqual('get');
    });

});