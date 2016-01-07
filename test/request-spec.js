
'use strict';

describe('ngRest.$request', function() {

    var $request,
        $httpBackend;

    beforeEach(module('ngRest.$request'));

    beforeEach(inject(function($injector) {
        $request = $injector.get('$request');
        $httpBackend = $injector.get('$httpBackend');
    }));

    it('should be a function', function() {
        expect(typeof $request).toEqual('function');
    });

    it('instance should be a function', function() {
        var instance = $request(null, null, null);
        expect(typeof instance).toEqual('function');
    });

    it('should has "url", "method", "schema"', function() {
        var schema = {
            params: {
                id: {
                    type: Number
                }
            }
        }

        var request = $request('http://localhost:8080/', 'get', schema);

        expect(request.getURL()).toEqual('http://localhost:8080/');
        expect(request.getMethod()).toEqual('get');
        expect(request.getSchema()).toEqual(schema);
    });

    it('should response success', function() {

        $httpBackend
            .expectGET('http://foo.com/users/?id=1')
            .respond(200, {
                id: 1,
                name: 'user'
            });

        var request = $request('http://foo.com/users/', 'GET', {
            params: {
                id: {
                    type: Number,
                    nullable: false
                }
            }
        });

        request({
            id: 1
        }).success(function(response) {
            expect(response.name).toEqual('user');
        });

        $httpBackend.flush();
    });

    it('should throw error when not nullable param is null', function() {

        $httpBackend
            .expectGET('http://bar.com/users/?id=1')
            .respond(200, {
                id: 1,
                name: 'user'
            });

        var request = $request('http://bar.com/users/', 'GET', {
            params: {
                id: {
                    type: Number,
                    nullable: false
                }
            }
        });

        // throws error before request
        expect(function() {
            request();
        }).toThrow();

        // response success
        request({ id : 1 }).success(function(response) {
            expect(response.id).toEqual(1);
            expect(response.name).toEqual('user');
        });

        $httpBackend.flush();
    });

});