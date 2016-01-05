
(function(angular) { 'use strict';

    var methodNames = [
        'get',
        'post',
        'put',
        'delete',
        'head',
        'options'
    ];

    var requestVariableTypes = [
        'params',
        'data'
    ];


    angular
        .module('ngRest.$api', [])

        .provider('$api', function() {

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
        });


    angular
        .module('ngRest.$endpoint', [ 'ngRest.$api' ])

        .factory('$endpoint', [

            '$api', '$http',

            function($api, $http) {

                function $Endpoint(uri) {
                    var instance = this;
                    instance.uri = uri;
                }

                $Endpoint.prototype = {

                    $$api: $api,
                    $$http: $http,

                    uri: '',

                    setURI: function(uri) {
                        this.uri = uri;
                        return this;
                    },
                    getURI: function() {
                        return this.uri;
                    },
                    getFullURL: function() {
                        return this.$$api.getBaseURI() + this.uri;
                    },
                    dispatch: function(requestSchema) {

                        var instance = this;

                        methodNames.forEach(function(method) {
                            if(requestSchema && requestSchema[method] !== undefined) {

                                var requestConfig = {
                                    method: method,
                                    url: instance.getFullURL()
                                };

                                // requestVariableTypes.forEach(function(type) {
                                //     if(method.type !== undefined)
                                //         requestConfig[type] = method.type
                                // });

                                // add '$' to avoid of collision with uri.
                                instance['$' + method] = function(json) {
                                    return instance.$$http(requestConfig);
                                };

                            }
                        });

                        return instance;
                    }
                };

                return new $Endpoint();
            }
        ]);


    // compose
    angular
        .module('ngRest', [
            'ngRest.$api',
            'ngRest.$endpoint'
        ]);

})(angular);

