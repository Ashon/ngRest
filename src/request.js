(function(angular) {

    var requestVariableTypes = [
        'params', 'data'
    ];

    var $$RequestProvider = function() {

        this.$get = [

            '$http', '$exceptionHandler', '$validator',

            function($http, $exceptionHandler, $validator) {

                function $Request(url, requestSchema, method) {

                    var $request = this;

                    $request.$config = {
                        method: method,
                        url: url
                    };

                    return function(requestData) {

                        $request.$schema = requestSchema;
                        $request.$rawData = requestData;

                        requestVariableTypes.forEach(function(bodyType) {
                            if($request.$schema[method][bodyType] !== undefined) {
                                try {
                                    $request.$config[bodyType] = $validator.validate(
                                        $request.$schema[method][bodyType], requestData);
                                } catch(msg) {
                                    $exceptionHandler(url + ' [' + method.toUpperCase() + '] ' + msg);
                                }
                            };
                        });

                        return $http($request.$config);
                    };
                }

                $Request.prototype = {
                    $schema: undefined,
                    $config: undefined,
                    $rawData: undefined,
                };

                return function(url, requestSchema, method) {
                    return new $Request(url, requestSchema, method);
                };
            }
        ];
    }

    angular.module('ngRest.$request', [ 'ngRest.$validator' ])
        .provider('$request', $$RequestProvider);

})(angular);
