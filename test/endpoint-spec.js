
describe('ngRest.$endpoint', function() {

    beforeEach(module('ngRest.$endpoint'));

    var $api;
    var $endpoint;


    beforeEach(inject(function($injector) {
        $api = $injector.get('$api');
        $endpoint = $injector.get('$endpoint');
    }));

    it('should getFullURL() composition of $api\'s baseURI and $endpoint\'s uri', function() {

        $api.setBaseURI('http://test.com/');
        var instance = $endpoint().setURI('blog/');

        expect(instance.getFullURL()).toEqual('http://test.com/blog/');

    });

    it('should be different instance', function() {
        $api.setBaseURI('http://test.com/');

        var instanceA = $endpoint().setURI('blog/');
        var instanceB = $endpoint().setURI('user/');

        expect(instanceA.getFullURL()).toEqual('http://test.com/blog/');
        expect(instanceB.getFullURL()).toEqual('http://test.com/user/');

        expect(instanceA === instanceB).toEqual(false);
    });


    it('ngRest.$endpoint - dispatch test', function() {

        // provider settings
        $api.setBaseURI('http://localhost:8080/');

        // factory instance
        var instance = $endpoint().setURI('blog/');

        instance.dispatch({
            get: {
                params: {
                    id: String
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

        expect(instance.getFullURL()).toEqual('http://localhost:8080/blog/');

        expect(typeof instance.$get).toEqual('function');
        expect(typeof instance.$post).toEqual('function');

        expect(typeof instance.$put).toEqual('undefined');

    });

});
