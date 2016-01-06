
(function(angular) { 'use strict';

    var $$ApiProvider = function() {

        var provider = this;

        this.routes = {};

        this.setBaseURL = function(URL) {
            return provider;
        };

        this.getBaseURL = function(URL) {
            return baseURL;
        };

        this.registerEndpoint = function($endpoint) {
            return provider;
        };

        // expose provider
        this.$get = function() {
            return provider;
        };

    };

    angular
        .module('ngRest.$api', [ 'ngRest.$endpoint' ])
        .provider('$api', $$ApiProvider);

})(angular);
