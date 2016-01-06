
(function(angular) { 'use strict';

    var $$ApiProvider = function() {

        var provider = this;
        var baseURL = '';

        this.setBaseURL = function(URL) {
            baseURL = URL;
            return provider;
        };

        this.getBaseURL = function(URL) {
            return baseURL;
        };

        this.registerEndpoint = function($request) {
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

})(angular)