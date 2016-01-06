
describe('ngRest.$api', function() {

    beforeEach(module('ngRest.$api'));

    var $api;

    beforeEach(inject(function($injector) {

        $api = $injector.get('$api');

    }));

});
