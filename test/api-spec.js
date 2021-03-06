
'use strict';

describe('ngRest.$api', function() {

    beforeEach(module('ngRest.$api'));

    var $api,
        $apiConfig,
        $endpoint,
        $endpointConfig;

    beforeEach(inject(function($injector) {

        $api = $injector.get('$api');
        $apiConfig = $injector.get('$apiConfig');
        $endpoint = $injector.get('$endpoint');
        $endpointConfig = $injector.get('$endpointConfig');

    }));

    it('should be success to load components', function() {

        expect($api).toBeDefined();
        expect($apiConfig).toBeDefined();
        expect($endpoint).toBeDefined();
        expect($endpointConfig).toBeDefined();

    });

    it('should has setBaseRoute, getBaseRoute', function() {

        expect($apiConfig.setBaseRoute).toBeDefined();
        expect($apiConfig.getBaseRoute).toBeDefined();
        expect($apiConfig.nothing).toBeUndefined();

    });

    it('should has equal function between $apiConfig facade and $endpointConfig facade', function() {

        expect($apiConfig.setBaseRoute).toEqual($endpointConfig.setBaseRoute);
        expect($apiConfig.getBaseRoute).toEqual($endpointConfig.getBaseRoute);

    });

    it('should has equal baseRoute between $apiConfig and $endpointConfig which called in $apiConfig.setBaseRoute()', function() {

        $apiConfig.setBaseRoute('/user/');

        expect($apiConfig.getBaseRoute()).toEqual('/user/');
        expect($endpointConfig.getBaseRoute()).toEqual('/user/');

    });

    it('should has eqaul baseRoute between $apiConfig and $endpointConfig which called in $endpointConfig.setBaseRoute()', function() {

        $endpointConfig.setBaseRoute('/user/');

        expect($apiConfig.getBaseRoute()).toEqual('/user/');
        expect($endpointConfig.getBaseRoute()).toEqual('/user/');

    });

    it('should generate different instance', function() {

        var apiA = $api('apiA');
        var apiB = $api('apiB');

        expect(apiA).not.toEqual(apiB);
        expect(apiA.name).toEqual('apiA');
        expect(apiB.name).toEqual('apiB');

    });

    it('should share baseRoute between different instances', function() {

        var apiA = $api('apiA', '/test/');
        var apiB = $api('apiB');

        expect(apiA).not.toEqual(apiB);
        expect(apiA.getBaseRoute()).toEqual(apiB.getBaseRoute());

    });

    it('should be success to register endpoint', function() {

        var blogAPI = $api('blogAPI', '/blog/');
        var endpointA = blogAPI.$endpoint('post/');

        expect(blogAPI.getBaseRoute()).toEqual('/blog/');
        expect(blogAPI.post).toBeDefined();
        expect(endpointA.getURL()).toEqual('/blog/post/');
        expect(blogAPI.post.getURL()).toEqual('/blog/post/');
        expect(blogAPI.post.hasAvailableMethod()).toBeFalsy();

    });

    it('should be success to attach endpoint', function() {

        var blogAPI = $api('blogAPI', '/blog/');
        var endpointB = $endpoint('post/comment/');

        blogAPI.attach(endpointB);
        expect(endpointB.getURL()).toEqual('/blog/post/comment/');

        expect(blogAPI.post.comment).toBeDefined();
        expect(blogAPI.post.comment.getURL()).toEqual('/blog/post/comment/');
        expect(blogAPI.post.comment.hasAvailableMethod()).toBeFalsy();

    });

    it('should be success to attach endpoint with routeparam', function() {

        var blogAPI = $api('blogAPI', '/blog/');
        var endpointA = $endpoint('post/:postId/');
        var endpointB = $endpoint('post/:postId/comment/');
        var endpointC = $endpoint('post/:postId/comment/:commentId/');

        blogAPI.attach(endpointA);
        blogAPI.attach(endpointB);
        blogAPI.attach(endpointC);

        expect(blogAPI.post.comment.$$postId(123).getURL()).toEqual('/blog/post/123/comment/');
        expect(blogAPI.post.comment).toBeDefined();
        expect(blogAPI.post.comment.hasAvailableMethod()).toBeFalsy();

        expect(
            blogAPI.post.$$postId(1324).getURL()
        ).toEqual('/blog/post/1324/');

        expect(
            blogAPI.post.$$postId(1324).$$postId(123).getURL()
        ).toEqual('/blog/post/123/');

        expect(
            blogAPI.post.comment.$$postId(1324).getURL()
        ).toEqual('/blog/post/1324/comment/');

        expect(
            blogAPI.post.comment.$$commentId(13123451).$$postId(1324).getURL()
        ).toEqual('/blog/post/1324/comment/13123451/');

        // chain test
        expect(
            blogAPI.post.comment.$$postId(1324).$$commentId(1311231123123123).getURL()
        ).toEqual('/blog/post/1324/comment/1311231123123123/');

        expect(
            blogAPI.post.comment.$$postId(3123123123).$$commentId(13123451).$$postId(1324).getURL()
        ).toEqual('/blog/post/1324/comment/13123451/');

        expect(
            blogAPI.post.comment.$$postId(3123123123).$$postId(1324).$$commentId(13123451).getURL()
        ).toEqual('/blog/post/1324/comment/13123451/');

        expect(
            blogAPI.post.comment.$$postId(3123123123).$$postId(1324).$$commentId(13123451).$$postId(3123123123).getURL()
        ).toEqual('/blog/post/3123123123/comment/13123451/');

    });
});
