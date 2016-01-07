
(function(angular) { 'use strict';

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

        '$request', '$endpointConfig',

        function($request, $endpointConfig) {

            function $Endpoint(route) {
                this.$routePath = route;
            }

            $Endpoint.prototype = {

                $routePath: '',

                setRoutePath: function(routePath) {
                    this.$routePath = routePath;
                    return this;
                },
                getRoutePath: function() {
                    return this.$routePath;
                },
                getURL: function() {
                    return $endpointConfig.getBaseRoute() + this.$routePath;
                },
                registerMethod: function(scheme, method) {
                    // add '$' to avoid of collision with url.
                    this['$' + method] = $request(this.getURL(), method, scheme);
                    return this;
                },
                getAvailableMethods: function() {
                    var self = this;

                    var knownMethods = ['get', 'post', 'put', 'delete', 'patch', 'head', 'option'];

                    return knownMethods.map(function(method) {
                        return '$' + method;
                    }).filter(function($method) {
                        return Object.keys(self).indexOf($method) != -1;
                    });
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
            'ngRest.$request'
        ])
        .provider('$endpointConfig', $$EndpointConfigProvider)
        .factory('$endpoint', $$EndpointFactory);

})(angular);
