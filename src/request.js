(function(angular) {

    var $$RequestProvider = function() {

        this.$get = [

            '$http', '$exceptionHandler', '$validator',

            function($http, $exceptionHandler, $validator) {

                function $Request(url, method, schema) {

                    var $request = this;

                    $request.$schema = {};
                    $request.$config = {
                        method: method,
                        url: url
                    };

                    function $httpWrapper(requestData) {

                        $request.$schema = schema;
                        $request.$rawData = requestData;

                        angular.forEach($request.$schema, function(scheme, bodyType) {
                            try {
                                // if data validate failed, then raise exception.
                                $request.$config[bodyType] = $validator.validate(scheme, requestData);
                            } catch(msg) {
                                $exceptionHandler(url + ' [' + method.toUpperCase() + '] ' + msg);
                            }
                        });

                        return $http($request.$config);
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

                    return $httpWrapper;
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
