
describe('ngRest.$api', function() {

    beforeEach(module('ngRest.$api'));

    var $api,
        $endpoint,
        $endpointConfig;

    beforeEach(inject(function($injector) {

        $api = $injector.get('$api');
        $endpoint = $injector.get('$endpoint');
        $endpointConfig = $injector.get('$endpointConfig');

    }));

    it('should be success to load components', function() {
        expect($api).toBeDefined();
        expect($endpoint).toBeDefined();
        expect($endpointConfig).toBeDefined();
    });

    it('should has setBaseRoute, getBaseRoute', function() {

        expect($api.setBaseRoute).toBeDefined();
        expect($api.getBaseRoute).toBeDefined();

        expect($api.nothing).toBeUndefined();

    });

    it('should has equal function between $api facade and $endpointConfig facade', function() {

        expect($api.setBaseRoute).toEqual($endpointConfig.setBaseRoute);
        expect($api.getBaseRoute).toEqual($endpointConfig.getBaseRoute);

    });

    it('should has equal baseRoute between $api and $endpointConfig which called in $api.setBaseRoute()', function() {

        $api.setBaseRoute('/user/');

        expect($api.getBaseRoute()).toEqual('/user/');
        expect($endpointConfig.getBaseRoute()).toEqual('/user/');

    });

    it('should has eqaul baseRoute between $api and $endpointConfig which called in $endpointConfig.setBaseRoute()', function() {

        $endpointConfig.setBaseRoute('/user/');

        expect($api.getBaseRoute()).toEqual('/user/');
        expect($endpointConfig.getBaseRoute()).toEqual('/user/');

    });

});
