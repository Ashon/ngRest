
(function(angular) { 'use strict';

    function getSerializedURL(urlResolver) {
        return angular.isObject(urlResolver) ? urlResolver.get() : urlResolver;
    }

    var $$RequestProvider = function() {

        this.$get = [

            '$http', '$exceptionHandler', '$validator',

            function($http, $exceptionHandler, $validator) {

                function $Request(urlResolver, method, schema) {

                    var self = this;

                    self.$schema = schema;
                    self.$config = {
                        url: getSerializedURL(urlResolver),
                        method: method,
                    };

                    function $httpWrapper(requestData) {

                        self.$config.url = getSerializedURL(urlResolver);
                        self.$rawData = requestData;

                        if(angular.isDefined(self.$schema)) {
                            angular.forEach(self.$schema, function(schema, bodyType) {
                                try {
                                    // if data validate failed, then raise exception.
                                    self.$config[bodyType] = $validator.validate(schema, self.$rawData);

                                } catch(msg) {
                                    $exceptionHandler(self.$config.url + ' [' + method.toUpperCase() + '] ' + msg);
                                }
                            });
                        } else
                            angular.forEach(requestData, function(data, bodyType) {
                                self.$config[bodyType] = data
                            });

                        return $http(self.$config);
                    }

                    $httpWrapper.prototype = {
                        getURL: function() {
                            return getSerializedURL(urlResolver);
                        },
                        getMethod: function() {
                            return method;
                        },
                        getSchema: function() {
                            return schema;
                        }
                    };

                    return angular.extend($httpWrapper, $httpWrapper.prototype);
                }

                $Request.prototype = {
                    $schema: undefined,
                    $config: undefined,
                    $rawData: undefined,
                };

                return function(urlResolver, method, schema) {

                    return new $Request(urlResolver, method, schema);
                };
            }
        ];
    }


    angular.module('ngRest.$request', [ 'ngRest.$validator' ])
        .provider('$request', $$RequestProvider);


})(angular);
