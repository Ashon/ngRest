
describe('ngRest.$endpoint', function() {

    beforeEach(module('ngRest.$endpoint'));

    var $endpointConfig;
    var $endpoint;
    var $httpBackend;

    beforeEach(inject(function($injector) {
        $endpointConfig = $injector.get('$endpointConfig');
        $endpoint = $injector.get('$endpoint');
        $httpBackend = $injector.get('$httpBackend');
    }));

    it('should getURL() composition of $endpointConfig\'s baseURI and $endpoint\'s uri', function() {

        $endpointConfig.setBaseRoute('http://test.com/');
        var instance = $endpoint().setRoutePath('dummies/blog.json');

        expect(instance.getURL()).toEqual('http://test.com/dummies/blog.json');

    });

    it('should be different instance', function() {
        $endpointConfig.setBaseRoute('http://test.com/');

        var instanceA = $endpoint().setRoutePath('dummies/blog.json');
        var instanceB = $endpoint().setRoutePath('dummies/user.json');

        expect(instanceA.getURL()).toEqual('http://test.com/dummies/blog.json');
        expect(instanceB.getURL()).toEqual('http://test.com/dummies/user.json');

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

    it('$endpoint\'s request should be success', function() {
        $endpointConfig.setBaseRoute('/');

        var instance = $endpoint()
            .setRoutePath('dummies/blog.json')
            .dispatch({
                get: {
                    params: {
                        id: {
                            type: Number
                        }
                    }
                }
            });

        $httpBackend.expectGET('/dummies/blog.json?id=1').respond(200, {})

        var http = instance.$get({
            id: 1
        }).success(function(response) {
            expect(response).toEqual({})
        })

        $httpBackend.flush();

    })
});
