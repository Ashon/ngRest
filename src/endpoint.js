
(function(angular) { 'use strict';

    var methodNames = [
        'get', 'post', 'put',
        'delete', 'head', 'options'
    ];

    var $$EndpointFactory = [

        '$request', '$endpointConfig',

        function($request, $endpointConfig) {

            function $Endpoint(route) {
                var $endpoint = this;
                $endpoint.$routePath = route;
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
                    return $endpointConfig.getBaseURL() + this.$routePath;
                },
                dispatch: function(requestSchema) {

                    var $endpoint = this;

                    methodNames.forEach(function(method) {
                        if(requestSchema && requestSchema[method] !== undefined) {
                            // add '$' to avoid of collision with url.
                            $endpoint['$' + method] = $request(
                                $endpoint.getURL(), requestSchema, method);
                        }
                    });

                    return $endpoint;
                }
            };

            return function() {
                return new $Endpoint()
            };
        }
    ];

    // compose ngRest
    angular
        .module('ngRest.$endpoint', [
            'ngRest.$request'
        ])

        .provider('$endpointConfig', function() {
            this.baseURL = '';

            this.setBaseURL = function(url) {
                this.baseURL = url;
            };

            this.getBaseURL = function() {
                return this.baseURL;
            };

            this.$get = function() {
                return this;
            };
        })

        .factory('$endpoint', $$EndpointFactory);

})(angular);
