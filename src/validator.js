
(function(angular) { 'use strict';

    function isUndefined(value) {
        return value === undefined;
    }
    function isFunction(value) {
        return typeof value === 'function';
    }
    function isValidNumber(value) {
        return !isNaN(value) && isFinite(value);
    }
    function hasValue(object, key) {
        return !isUndefined(object) && !isUndefined(object[key]);
    }
    function hasSchemeType(scheme) {
        return hasValue(scheme, 'type');
    }
    function isNullableScheme(scheme) {
        return hasValue(scheme, 'nullable') && scheme.nullable === true;
    }
    function isSchemeTypeNumber(scheme) {
        return hasSchemeType(scheme) && scheme.type === Number;
    }

    // validation methods
    function raiseIfSchemeHasNoType(scheme, key) {
        if(!hasSchemeType(scheme))
            throw '\'' + key + '\' has no type';
    }
    function raiseIfDataIsNull(scheme, key, data) {
        if(!isNullableScheme(scheme) && !hasValue(data, key))
            throw '\'' + key + '\' does not exists.';
    }
    function raiseIfSchemeIsFunction(scheme, key, data) {
        if(isFunction(data))
            throw 'request data is function.';
    }
    function raiseIfDataIsNotValidNumber(scheme, key, data) {
        if(isSchemeTypeNumber(scheme))
            if(hasValue(data, key) && !isValidNumber(data[key]))
                throw key + ' \'' + data[key] + '\' is not valid number';
    }

    function $Validator() {}

    $Validator.prototype = {

        validate: function(schema, data) {

            if(isUndefined(schema))
                throw 'request schema is undefined';

            var cleanedData = {};

            angular.forEach(schema, function(scheme, key) {

                var validationRuleset = [
                    raiseIfSchemeHasNoType,
                    raiseIfDataIsNull,
                    raiseIfDataIsNotValidNumber,
                    raiseIfSchemeIsFunction
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
