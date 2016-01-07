(function(angular) {

    var $$RequestProvider = function() {

        this.$get = [

            '$http', '$exceptionHandler', '$validator',

            function($http, $exceptionHandler, $validator) {

                function $Request(url, method, schema) {

                    var self = this;

                    self.$schema = {};
                    self.$config = {
                        method: method,
                        url: url
                    };

                    function $httpWrapper(requestData) {

                        self.$schema = schema;
                        self.$rawData = requestData;

                        angular.forEach(self.$schema, function(schema, bodyType) {
                            try {
                                // if data validate failed, then raise exception.
                                self.$config[bodyType] = $validator.validate(schema, requestData);
                            } catch(msg) {
                                $exceptionHandler(url + ' [' + method.toUpperCase() + '] ' + msg);
                            }
                        });

                        return $http(self.$config);
                    }

                    $httpWrapper.prototype = {
                        getURL: function() {
                            return url;
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

                return function(url, method, schema) {
                    return new $Request(url, method, schema);
                };
            }
        ];
    }

    angular.module('ngRest.$request', [ 'ngRest.$validator' ])
        .provider('$request', $$RequestProvider);

})(angular);
