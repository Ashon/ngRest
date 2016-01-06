
(function(angular) { 'use strict';

    var methodNames = [
        'get', 'post', 'put',
        'delete', 'head', 'options'
    ];

    var $$EndpointFactory = [

        '$api', '$request',

        function($api, $request) {

            function $Endpoint(uri) {
                var $endpoint = this;
                $endpoint.uri = uri;
            }

            $Endpoint.prototype = {

                $$api: $api,

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

                    var $endpoint = this;

                    methodNames.forEach(function(method) {
                        if(requestSchema && requestSchema[method] !== undefined) {
                            // add '$' to avoid of collision with uri.
                            $endpoint['$' + method] = $request(
                                $endpoint.getFullURL(), requestSchema, method);
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
            'ngRest.$api',
            'ngRest.$request'
        ])
        .factory('$endpoint', $$EndpointFactory);

})(angular);
