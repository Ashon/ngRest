
(function(angular) { 'use strict';

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
                registerMethod: function(scheme, method) {
                    // add '$' to avoid of collision with url.
                    this['$' + method] = $request(this.getURL(), method, scheme);

                    return this;
                },
                dispatch: function(requestSchema) {

                    var $endpoint = this;

                    if(requestSchema !== undefined)
                        angular.forEach(requestSchema, function(scheme, method) {
                            $endpoint.registerMethod(scheme, method);
                        });

                    return $endpoint;
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
