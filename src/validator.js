
(function(angular) { 'use strict';

    function isValidNumber(value) {
        return !isNaN(value) && isFinite(value);
    }
    function hasValue(object, key) {
        return angular.isDefined(object) && angular.isDefined(object[key]);
    }
    function hasSchemeType(scheme) {
        return hasValue(scheme, 'type');
    }
    function isNullableScheme(scheme) {
        return hasValue(scheme, 'nullable') && scheme.nullable === true;
    }
    function isSchemeTypeNumber(scheme) {
        return hasSchemeType(scheme) && toString.call(scheme.type()) === '[object Number]';
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
        if(angular.isFunction(data))
            throw 'request data is function.';
    }
    function raiseIfDataIsNotValidNumber(scheme, key, data) {
        if(isSchemeTypeNumber(scheme) && hasValue(data, key) && !isValidNumber(data[key]))
            throw key + ' \'' + data[key] + '\' is not valid number';
    }

    function $Validator(rules) {
        this.$rules = rules;
    }

    $Validator.prototype = {

        $rules: [],

        validate: function(schema, data) {

            if(angular.isUndefined(schema))
                throw 'request schema is undefined';

            var self = this;
            var cleanedData = {};

            angular.forEach(schema, function(scheme, key) {

                self.$rules.forEach(function(rule) {
                    rule.call(null, scheme, key, data);
                });

                if(hasValue(data, key))
                    cleanedData[key] = data[key];

            });

            return cleanedData;
        }
    };

    var defaultRuleset = [
        raiseIfSchemeHasNoType,
        raiseIfDataIsNull,
        raiseIfDataIsNotValidNumber,
        raiseIfSchemeIsFunction
    ];

    var $$ValidatorFactory = function() {
        return new $Validator(defaultRuleset);
    };

    angular
        .module('ngRest.$validator', [])
        .factory('$validator', $$ValidatorFactory);

})(angular);
