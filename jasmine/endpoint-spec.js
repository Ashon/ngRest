
describe('ngRest - $endpoint Test', function() {

    beforeEach(module('ngRest.$endpoint'));

    var $api;
    var $endpoint;


    beforeEach(inject(function($injector) {
        $api = $injector.get('$api');
        $endpoint = $injector.get('$endpoint');
    }));


    it('ngRest.$endpoint - uri test', function() {

        $api.setBaseURI('http://test.com/');
        $endpoint.setURI('blog/');

        expect($endpoint.getFullURL()).toEqual('http://test.com/blog/');

    });


    it('ngRest.$endpoint - dispatch test', function() {

        // provider settings
        $api.setBaseURI('http://localhost:8080/');

        // factory instance
        $endpoint.setURI('blog/');

        $endpoint.dispatch({
            get: {
                params: {
                    query: String
                }
            },
            post: {
                data: {
                    title: String,
                    content: String,
                    author: String
                }
            }
        });

        expect($endpoint.getFullURL()).toEqual('http://localhost:8080/blog/');

        expect(typeof $endpoint.$get).toEqual('function');
        expect(typeof $endpoint.$post).toEqual('function');

        expect(typeof $endpoint.$put).toEqual('undefined');

    });

});
