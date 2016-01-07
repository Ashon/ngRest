
(function(angular) { 'use strict';

    var $$ApiProvider = function() {

        var self = this;

        this.routes = {};

        this.registerEndpoint = function($endpoint) {
            return self;
        };

        // expose provider
        this.$get = [

            '$endpointConfig',

            function($endpointConfig) {

                var facades = [
                    'setBaseRoute',
                    'getBaseRoute'
                ];

                facades.forEach(function(fn) {
                    self[fn] = $endpointConfig[fn];
                })

                return self;
            }
        ];

    };

    angular
        .module('ngRest.$api', [ 'ngRest.$endpoint' ])
        .provider('$api', $$ApiProvider);

})(angular);
