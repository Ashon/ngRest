
(function(angular) { 'use strict';

    var $$URLResolverFactory = function() {

        function $URLResolver(route) {
            this.setRoute(route);
        }

        $URLResolver.prototype = {

            $urlPrefix: '',
            $routePath: '',
            $routeParam: undefined,
            $$compiledRoute: undefined,

            setUrlPrefix: function(prefix) {
                this.$urlPrefix = prefix;
            },
            getUrlPrefix: function() {
                return this.$urlPrefix;
            },
            setRoute: function(routePath) {

                this.flush();
                this.$routePath = routePath;

                return this;
            },
            setRouteParam: function(paramName, value) {
                this.$routeParam[paramName] = value;
            },
            compile: function() {
                var compiledRoute = this.$routePath;

                function compileParam(value, key) {
                    compiledRoute = compiledRoute.replace(':' + key, value);
                }

                angular.forEach(this.$routeParam, compileParam);
                this.$$compiledRoute = compiledRoute;

                return this;
            },
            flush: function() {
                this.$routeParam = {};
                this.$$compiledRoute = undefined;
            },
            get: function() {
                this.compile();
                return this.$urlPrefix + this.$$compiledRoute;
            }
        };

        return function(route) {
            return new $URLResolver(route);
        };
    };

    angular
        .module('ngRest.$urlResolver', [])
        .factory('$urlResolver', $$URLResolverFactory);

})(angular);
