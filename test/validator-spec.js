
'use strict';

describe('ngRest.$validator', function() {

    beforeEach(module('ngRest.$validator'));

    var $validator;

    beforeEach(inject(function($injector) {

        $validator = $injector.get('$validator');

    }));

    it('should be object type', function() {
        expect(typeof $validator).toEqual('object');
    });

    it('"validate" should be a function', function() {
        expect(typeof $validator.validate).toEqual('function');
    });

    it('should throw "must not be a function" when request data\'s type is "function"', function() {
        var testSchema = {
            id: {
                type: Number
            }
        };
        var functionData = function() {};

        expect(function() {
            $validator.validate(testSchema, functionData);
        }).toThrow();

    });

    it('should throw "scheme has no type" when scheme is undefined', function() {
        var testSchema = {
            a: {
                type: String
            },
            id: undefined
        };

        expect(function() {
            $validator.validate(testSchema, {});
        }).toThrow();
    });

    it('should throw error when schema is undefined', function() {
        var testSchema = undefined;

        expect(function() {
            $validator.validate(testSchema, {});
        }).toThrow();
    });

    it('should throw "does not exists" when scheme is not null but param is null', function() {
        var testSchema = {
            id: {
                type: Number,
                nullable: false
            },
            author: {
                type: String,
                nullable: true
            }
        };

        expect(function() {
            var noIDRequestData = {
                author: 'user'
            };
            $validator.validate(testSchema, noIDRequestData);

        }).toThrow();
    });

    it('should throw "not a number" when params is not a number', function() {
        var testSchema = {
            id: {
                type: Number,
                nullable: false
            },
            author: {
                type: String,
                nullable: true
            }
        };

        expect(function() {
            var idIsNotANumberRequestData = {
                id:'1a'
            };

            $validator.validate(testSchema, idIsNotANumberRequestData);

        }).toThrow();
    });

    it('should returns cleaned data', function() {
        var testSchema = {
            id: {
                type: Number,
                nullable: false
            },
            author: {
                type: String,
                nullable: true
            }
        };

        var validDataA = {
            id: '12',
            author: 'user'
        };

        var validDataB = {
            id: 1
        };

        expect($validator.validate(testSchema, validDataA)).toEqual(validDataA);
        expect($validator.validate(testSchema, validDataB)).toEqual(validDataB);

    });

    it('should throw error when param is null', function() {

        var testSchema = {
            id: {
                type: Number,
                nullable: false
            },
            author: {
                type: String,
                nullable: true
            }
        };

        expect(function() {
            var noIDRequestData = {
                author: 'user'
            };

            $validator.validate(testSchema, noIDRequestData);

        }).toThrow();
    });

});
