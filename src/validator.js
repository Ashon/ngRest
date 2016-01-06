
(function(angular) { 'use strict';

    // Exceptions
    function schemaIsUndefined() {
        return 'request schema is undefined';
    }
    function schemeHasNoType(key) {
        return '\'' + key + '\' has no type';
    }
    function doesNotExists(key) {
        return '\'' + key + '\' does not exists.';
    }
    function notANumber(key, value) {
        return key + ' \'' + value + '\' is not a number';
    }
    function paramIsFunction() {
        return 'request data is function.';
    }

    // validation methods
    function _validateSchemeHasType(scheme, key) {
        if(scheme === undefined || scheme.type === undefined)
            throw schemeHasNoType(key);
    }
    function _validateNullable(scheme, key, data) {
        if(scheme.nullable !== undefined)
            if(scheme.nullable === false) {
                if(data === undefined)
                    throw doesNotExists(key);
                else
                    if(data[key] === undefined)
                        throw doesNotExists(key);
            }
    }
    function _validateNumber(scheme, key, data) {
        if(scheme.type === Number)
            if(data !== undefined && scheme.type(data[key]).toString() === 'NaN')
                throw notANumber(key, data[key]);
    }
    function _validateFunction(scheme, key, data) {
        if(typeof data === 'function')
            throw paramIsFunction();
    }

    function $Validator() {}

    $Validator.prototype = {

        validate: function(schema, data) {

            if(schema === undefined)
                throw schemaIsUndefined();

            var cleanedData = {};

            angular.forEach(schema, function(scheme, key) {

                var validationRuleset = [
                    _validateSchemeHasType,
                    _validateNullable,
                    _validateNumber,
                    _validateFunction
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

    var $$ValidatorFactory = function() {
        return new $Validator();
    };

    angular
        .module('ngRest.$validator', [])
        .factory('$validator', $$ValidatorFactory);

})(angular);
