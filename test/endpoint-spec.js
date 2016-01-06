
describe('ngRest.$endpoint', function() {

    beforeEach(module('ngRest.$endpoint'));

    var $endpointConfig;
    var $endpoint;


    beforeEach(inject(function($injector) {
        $endpointConfig = $injector.get('$endpointConfig');
        $endpoint = $injector.get('$endpoint');
    }));

    it('should getURL() composition of $endpointConfig\'s baseURI and $endpoint\'s uri', function() {

        $endpointConfig.setBaseRoute('http://test.com/');
        var instance = $endpoint().setRoutePath('blog/');

        expect(instance.getURL()).toEqual('http://test.com/blog/');

    });

    it('should be different instance', function() {
        $endpointConfig.setBaseRoute('http://test.com/');

        var instanceA = $endpoint().setRoutePath('blog/');
        var instanceB = $endpoint().setRoutePath('user/');

        expect(instanceA.getURL()).toEqual('http://test.com/blog/');
        expect(instanceB.getURL()).toEqual('http://test.com/user/');

        expect(instanceA === instanceB).toEqual(false);
    });


    it('ngRest.$endpoint - dispatch test', function() {

        // provider settings
        $endpointConfig.setBaseRoute('http://localhost:8080/');

        // factory instance
        var instance = $endpoint().setRoutePath('blog/');

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

        expect(instance.getURL()).toEqual('http://localhost:8080/blog/');

        expect(typeof instance.$get).toEqual('function');
        expect(typeof instance.$post).toEqual('function');

        expect(typeof instance.$put).toEqual('undefined');

    });

});
