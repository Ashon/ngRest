
(function(angular) { 'use strict';

    var $$EndpointConfigProvider = function() {
        this.baseURL = '/';

        this.setBaseRoute = function(url) {
            this.baseURL = url;
        };

        this.getBaseRoute = function() {
            return this.baseURL;
        };

        this.$get = function() {
            return this;
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
                dispatch: function(requestSchema) {

                    var self = this;

                    angular.forEach(requestSchema, function(scheme, method) {
                        self.registerMethod(scheme, method);
                    });

                    return self;
                }
            };

            return function() {
                return new $Endpoint();
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
