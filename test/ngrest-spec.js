
describe('ngRest', function() {

    var $api,
        $apiConfig,
        $validator,
        $request,
        $endpoint,
        $endpointConfig;

    beforeEach(module('ngRest'));

    beforeEach(inject(function($injector) {

        $api = $injector.get('$api');
        $apiConfig = $injector.get('$apiConfig');
        $validator = $injector.get('$validator');
        $request = $injector.get('$request');
        $endpoint = $injector.get('$endpoint');
        $endpointConfig = $injector.get('$endpointConfig');

    }));

    it('should be success to load all components', function() {

        expect($api).toBeDefined();
        expect($apiConfig).toBeDefined();
        expect($validator).toBeDefined();
        expect($request).toBeDefined();
        expect($endpoint).toBeDefined();
        expect($endpointConfig).toBeDefined();

    });
});
