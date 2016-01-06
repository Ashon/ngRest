
describe('ngRest.$validator', function() {

    beforeEach(module('ngRest.$validator'));

    var $validator;

    beforeEach(inject(function($injector) {

        $validator = $injector.get('$validator');

    }));

    it('should be object type', function() {
        expect(typeof $validator).toEqual('object');
    });

    it('should be a function', function() {
        expect(typeof $validator.validate).toEqual('function');
    });

    it('should throw "must not be a function"', function() {
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

    it('should scheme has type', function() {
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

    it('undefined schema should throw', function() {
        var testSchema = undefined;

        expect(function() {
            $validator.validate(testSchema, {});
        }).toThrow();
    });

    it('should throw "does not exists"', function() {
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

    it('should throw "not a number"', function() {
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

    it('should pass validate data', function() {
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

    it('should pass to nullable data', function() {

        var testSchema = {
            id: {
                type: Number,
                nullable: true
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
