
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

    it('"getURL()"s return value should be composition of $endpointConfig\'s baseRoute and $endpoint\'s routePath', function() {

        $endpointConfig.setBaseRoute('http://test.com/');
        var instance = $endpoint().setRoutePath('dummies/blog.json');

        expect(instance.getURL()).toEqual('http://test.com/dummies/blog.json');

    });

    it('each instance should be different', function() {
        $endpointConfig.setBaseRoute('http://test.com/');

        var instanceA = $endpoint().setRoutePath('dummies/blog.json');
        var instanceB = $endpoint().setRoutePath('dummies/user.json');

        expect(instanceA.getURL()).toEqual('http://test.com/dummies/blog.json');
        expect(instanceB.getURL()).toEqual('http://test.com/dummies/user.json');

        expect(instanceA === instanceB).toEqual(false);
    });


    it('dispatched instance has $[method] function', function() {

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

    it('"request" which has nullable param should response success', function() {
        $endpointConfig.setBaseRoute('/');

        var instance = $endpoint()
            .setRoutePath('dummies/blog.json')
            .dispatch({
                get: {
                    params: {
                        id: {
                            type: Number,
                            nullable: true
                        }
                    }
                }
            });

        $httpBackend.expectGET('/dummies/blog.json?id=1').respond(200, {
            id: 1,
            title: 'hello ngRest',
        });

        instance.$get({
            id: 1
        }).success(function(response) {
            expect(response).toEqual({
                id: 1,
                title: 'hello ngRest',
            });
        });

        $httpBackend.flush();

        $httpBackend.expectGET('/dummies/blog.json').respond(200, {
            id: 1,
            title: 'hello ngRest',
        });

        instance.$get().success(function(response) {
            expect(response).toEqual({
                id: 1,
                title: 'hello ngRest',
            });
        });

        $httpBackend.flush();

    });

    it('"request" which has not nullable param should throw error', function() {

        $endpointConfig.setBaseRoute('/');

        var instance = $endpoint()
            .setRoutePath('dummies/blog.json')
            .dispatch({
                get: {
                    params: {
                        id: {
                            type: Number,
                            nullable: false
                        }
                    }
                }
            });

        expect(function() {
            $httpBackend.expectGET('/dummies/blog.json').respond(200, {
                title: 'hello ngRest',
            });

            instance.$get();

            $httpBackend.flush();
        }).toThrow();

    });

});
