
(function(angular) { 'use strict';

    // Exceptions
    function doesNotExists(key) {
        return '\'' + key + '\' does not exists.';
    }

    function notANumber(key, value) {
        return key + ' \'' + value + '\' is not a number';
    }

    var $$ValidatorFactory = [

        function() {

            // validation methods
            function _validateNullable(scheme, key, data) {
                if(scheme.nullable === undefined || scheme.nullable === true) {

                } else {
                    if(data === undefined || data[key] === undefined)
                        throw doesNotExists(key);
                }
            }

            function _validateNumber(scheme, key, data) {
                if(scheme.type === Number)
                    if(scheme.type(data[key]).toString() === 'NaN')
                        throw notANumber(key, data[key]);
            }

            function $Validator() {}

            $Validator.prototype = {

                validate: function(schema, data) {

                    var cleanedData = {};

                    angular.forEach(schema, function(scheme, key) {

                        var validationRuleset = [
                            _validateNullable,
                            _validateNumber
                        ];

                        validationRuleset.forEach(function(rule) {
                            rule.call(null, scheme, key, data);
                        });

                        if(data !== undefined && data[key] !== undefined)
                            cleanedData[key] = data[key];
                    });

                    return cleanedData;
                }
            };

            return new $Validator();
        }
    ];

    angular
        .module('ngRest.$validator', [])
        .factory('$validator', $$ValidatorFactory);

})(angular);
