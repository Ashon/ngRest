
(function(angular) { 'use strict';


    var knownMethods = [
        'get', 'post', 'put', 'delete',
        'patch', 'head', 'option'];

    function add$(value) {
        return '$' + value;
    }

    var $$EndpointConfigProvider = function() {

        var self = this;

        self.baseURL = '/';

        self.setBaseRoute = function(url) {
            self.baseURL = url;
        };

        self.getBaseRoute = function() {
            return self.baseURL;
        };

        self.$get = function() {
            return self;
        };
    };


    var $$EndpointFactory = [

        '$request', '$endpointConfig', '$urlResolver',

        function($request, $endpointConfig, $urlResolver) {

            function $Endpoint(route) {
                this.setRoutePath(route || '');
                this.$$urlResolver.setUrlPrefix($endpointConfig.getBaseRoute());
            }

            $Endpoint.prototype = {

                $$routePath: '',
                $$urlResolver: undefined,

                setRoutePath: function(routePath) {
                    var self = this;

                    function hasLength(value) {
                        return value.length > 0;
                    }

                    function dispatchRouteParam(path) {
                        var urlRouteParams = path.split(':');

                        if(urlRouteParams[0].length === 0) {
                            var routeParamName = urlRouteParams[1];

                            self['$$' + routeParamName] = function(value) {
                                self.$$urlResolver.setRouteParam(routeParamName, value);

                                return self;
                            }
                        }
                    }

                    if(angular.isUndefined(self.$$urlResolver))
                        self.$$urlResolver = new $urlResolver(routePath);
                    else
                        self.$$urlResolver.setRoute(routePath);

                    self.$$routePath = routePath;
                    self.$$routePath.split('/').filter(hasLength).forEach(dispatchRouteParam);

                    return self;
                },
                flush: function() {
                    this.$$urlResolver.flush();

                    return this;
                },
                getRoutePath: function() {
                    return this.$$routePath;
                },
                getURL: function() {
                    var self = this;

                    return self.$$urlResolver.get();
                },
                registerMethod: function(scheme, method) {

                    // add '$' to avoid of collision with url.
                    this[add$(method.toLowerCase())] = $request(this.$$urlResolver, method, scheme);

                    return this;
                },
                getAvailableMethods: function() {

                    var self = this;
                    function hasItemIterator(value) {
                        return Object.keys(self).indexOf(value) != -1;
                    }

                    return knownMethods.map(add$).filter(hasItemIterator);

                },
                hasAvailableMethod: function() {
                    return this.getAvailableMethods().length > 0;
                },
                dispatch: function(requestSchema) {

                    var self = this;
                    angular.forEach(requestSchema, function(scheme, method) {
                        self.registerMethod(scheme, method);
                    });

                    return self;
                },
                setBaseRoute: $endpointConfig.setBaseRoute,
                getBaseRoute: $endpointConfig.getBaseRoute
            };

            return function(route) {
                return new $Endpoint(route);
            };
        }
    ];


    // compose ngRest
    angular
        .module('ngRest.$endpoint', [
            'ngRest.$request', 'ngRest.$urlResolver'
        ])
        .provider('$endpointConfig', $$EndpointConfigProvider)
        .factory('$endpoint', $$EndpointFactory);


})(angular);
