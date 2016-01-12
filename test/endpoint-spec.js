
'use strict';

describe('ngRest.$endpoint', function() {

    beforeEach(module('ngRest.$endpoint'));

    var $endpoint,
        $endpointConfig,
        $httpBackend;

    beforeEach(inject(function($injector) {

        $endpointConfig = $injector.get('$endpointConfig');
        $endpoint = $injector.get('$endpoint');
        $httpBackend = $injector.get('$httpBackend');

    }));


    it('should has eqaul baseRoute between $endpointConfig and $endpoint which called in $endpointConfig', function() {

        $endpointConfig.setBaseRoute('/test/');

        expect($endpoint().getBaseRoute()).toEqual('/test/');
        expect($endpointConfig.getBaseRoute()).toEqual('/test/');
    });

    it('should has eqaul baseRoute between $endpointConfig and $endpoint which called in $endpoint', function() {

        $endpoint().setBaseRoute('/test/');

        expect($endpoint().getBaseRoute()).toEqual('/test/');
        expect($endpointConfig.getBaseRoute()).toEqual('/test/');

    });

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

        expect(instanceA).not.toEqual(instanceB);

    });

    it('endpoint has no available methods', function() {

        var instance = $endpoint('blog/');

        expect(instance.hasAvailableMethod()).toBeFalsy();
        expect(instance.getAvailableMethods().length).toEqual(0);

    });

    it('dispatched endpoint has available methods', function() {

        var instance = $endpoint('blog/');

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

        expect(instance.hasAvailableMethod()).toBeTruthy();
        expect(instance.getAvailableMethods().length).toEqual(2);

    });


    it('dispatched instance has $[method] function', function() {

        // provider settings
        $endpointConfig.setBaseRoute('http://localhost:8080/');

        // factory instance
        var instance = $endpoint('blog/');

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

        var instance = $endpoint('dummies/blog.json');
        instance.dispatch({
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

        var instance = $endpoint('dummies/blog.json')
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

        $httpBackend.expectGET('/dummies/blog.json?id=1').respond(200, {
            title: 'hello ngRest',
        });

        // throw error before request
        expect(function() {
            instance.$get();
        }).toThrow();

        // response success
        instance.$get({ id : 1 }).success(function(response) {
            expect(response.title).toEqual('hello ngRest');
        });

        $httpBackend.flush();

    });

    it('should has url route params', function() {

        var endpointA = $endpoint('users/:userId/groups/');
        expect(endpointA.$$userId).toBeDefined();
        expect(endpointA.$$userId('123').getURL()).toEqual('/users/123/groups/');
        expect(endpointA.$$userId(123).getURL()).toEqual('/users/123/groups/');

        var endpointB = $endpoint('users/:userId/groups/:groupId/');
        expect(endpointB.$$userId).toBeDefined();
        expect(endpointB.$$groupId).toBeDefined();

        expect(endpointB.$$userId(123).$$groupId('456').getURL()).toEqual('/users/123/groups/456/');
        expect(endpointB.$$groupId(456).$$userId(123).getURL()).toEqual('/users/123/groups/456/');

    });

    it('should compile url dynamically', function() {

        var endpoint = $endpoint('users/:userId/groups/:groupId/');

        expect(endpoint.$$userId(123).$$groupId('456').getURL()).toEqual('/users/123/groups/456/');

        endpoint.flush();
        expect(endpoint.$$userId(123).getURL()).toEqual('/users/123/groups/:groupId/');

    });

    it('should pass to request with url route params', function() {

        $httpBackend.expectGET('/users/123/groups/?id=1').respond(200, {
            message: 'success'
        });

        $httpBackend.expectGET('/users/456/groups/?id=3').respond(200, {
            message: 'failed'
        });

        $httpBackend.expectGET('/users/78/groups/').respond(200, {
            message: 'hi'
        });

        var endpoint = $endpoint('users/:userId/groups/')
            .registerMethod({
                params: {
                    id: {
                        type: Number,
                        nullable: true
                    }
                }
            }, 'get')

        expect(endpoint.getURL()).toEqual('/users/:userId/groups/');

        endpoint
            .$$userId(123)
            .$get({ id: 1 }).success(function(response) {
                expect(response.message).toEqual('success');
            });

        endpoint
            .$$userId(456)
            .$get({ id: 3 }).success(function(response) {
                expect(response.message).toEqual('failed');
            });

        endpoint
            .$$userId(78)
            .$get().success(function(response) {
                expect(response.message).toEqual('hi');
            });

        $httpBackend.flush();

    });

});
