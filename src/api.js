
(function(angular) { 'use strict';

    var $$ApiProvider = function() {

        var provider = this;
        var baseURI = '';

        this.setBaseURI = function(URI) {
            baseURI = URI;
            return provider;
        };

        this.getBaseURI = function(URI) {
            return baseURI;
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
        .module('ngRest.$api', [])
        .provider('$api', $$ApiProvider);

})(angular)