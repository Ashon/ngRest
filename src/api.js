
(function(angular) { 'use strict';


    var $$ApiConfigProvider = function() {

        // expose provider
        this.$get = [

            '$endpointConfig',

            function($endpointConfig) {
                return $endpointConfig;
            }
        ];

    };


    var $$ApiFactory = [

        '$apiConfig', '$endpoint',

        function($apiConfig, $endpoint) {

            function $API(name, baseRoute) {
                this.name = name;
                $apiConfig.setBaseRoute(baseRoute);
            }

            $API.prototype = {

                _routes: {},

                $endpoint: function(route) {
                    var endpoint = $endpoint(route);

                    // register endpoint to routes
                    this.attach(endpoint);

                    return endpoint;
                },

                attach: function($endpoint) {

                    var cursor = this._routes;

                    function hasLength(value) {
                        return value.length > 0;
                    }

                    function bindEndpoint(path, index, array) {
                        var urlRouteParams = path.split(':');

                        if(urlRouteParams[0] !== '') {
                            if(angular.isUndefined(cursor[path]))
                                cursor[path] = {};

                            if(index === array.length - 1) {
                                if(angular.isUndefined(cursor[path].$routePath))
                                    cursor[path] = angular.extend($endpoint, cursor[path]);
                            } else
                                cursor = cursor[path];
                        } else {
                            if(index === array.length - 1)
                                cursor['$$' + urlRouteParams[1]] = angular.extend($endpoint['$$' + urlRouteParams[1]], $endpoint);
                        }
                    }

                    $endpoint
                        .getRoutePath()
                        .split('/')
                        .filter(hasLength)
                        .forEach(bindEndpoint);

                    angular.extend(this, this._routes);

                    return this;
                },

                setBaseRoute: $apiConfig.setBaseRoute,
                getBaseRoute: $apiConfig.getBaseRoute,
            };

            return function(name, baseRoute) {
                return new $API(name, baseRoute);
            }
        }
    ];


    angular
        .module('ngRest.$api', [ 'ngRest.$endpoint' ])
        .provider('$apiConfig', $$ApiConfigProvider)
        .factory('$api', $$ApiFactory);


})(angular);
