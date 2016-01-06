var blogReadSchema = {
    id: {
        type: Number,
        nullable: false
    },
    author: {
        type: String,
        nullable: true
    }
};

var blogWriteSchema = {
    title: {
        type: String
    },
    content: {
        type: String
    },
    author: {
        type: String
    }
};

angular
    .module('ngRestEndpointTest', ['ngRest'])

    .config(function($apiProvider) {
        $apiProvider.setBaseURI('http://localhost:8080/')
    })

    .controller('endpointRequestTest', function($scope, $endpoint) {

        $endpoint()
            .setURI('dummies/blog.json')
            .dispatch({
                get: {
                    params: blogReadSchema
                },
                post: {
                    data: blogWriteSchema
                }
            })

            .$get({
                id: '1234',
                author: 'user'
            })

            .success(function(response, status, headers, config) {
                // console.log(response);
                // console.log(status);
                // console.log(headers);
                // console.log(config);
            })

            .error(function(msg, code) {
                console.log(msg, code);
            });
    })

    .controller('endpointNullableExceptionTest', function($scope, $endpoint) {
        var a = $endpoint()
            .setURI('dummies/blog.json')
            .dispatch({
                get: {
                    params: blogReadSchema
                },
                post: {
                    data: blogWriteSchema
                }
            });

        a.$get({
            author: 'user'
        });

        a.$get({
            id:1
        });

        var b = $endpoint()
            .setURI('dummies/user.json')
            .dispatch({
                get: {
                    params: {
                        username: {
                            type:String
                        }
                    }
                }
            });

        b.$get();
        console.log(a !== b)
    });