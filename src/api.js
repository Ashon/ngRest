
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
                    var self = this;

                    var parsedPath = $endpoint.getRoutePath().split('/').filter(function(path) {
                        return path.length > 0;
                    });

                    var cursor = self._routes;

                    parsedPath.forEach(function(path, index) {

                        if(angular.isUndefined(cursor[path]))
                            cursor[path] = {};

                        if(index === parsedPath.length - 1) {
                            if(angular.isUndefined(cursor[path].$routePath))
                                cursor[path] = angular.extend($endpoint, cursor[path]);
                        } else
                            cursor = cursor[path];

                    });

                    angular.extend(self, self._routes)
                },
                setBaseRoute: $apiConfig.setBaseRoute,
                getBaseRoute: $apiConfig.getBaseRoute,
            }

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
