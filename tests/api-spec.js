
describe('ngRest - $api Test', function() {

    beforeEach(module('ngRest.$api'));

    var $api;

    beforeEach(inject(function($injector) {

        $api = $injector.get('$api');

    }));

    it('ngRest.$api - set base uri test', function() {

        $api.setBaseURI('http://test.com/');
        expect($api.getBaseURI()).toEqual('http://test.com/');

    });

});
