(function() {

    var app = angular.module('actuate', ['ngRoute']);
    var managementURL = getManagementURL();

    app.config(function($routeProvider) {
        $routeProvider.when('/health',{
            templateUrl : 'health.html'
        }).when('/metrics',{
            templateUrl : 'metrics.html'
        }).when('/beans',{
            templateUrl : 'beans.html'
        }).when('/env',{
            templateUrl : 'env.html'
        }).when('/mappings',{
            templateUrl : 'mappings.html'
        }).when('/configprops',{
            templateUrl : 'configprops.html'
        }).otherwise({
            templateUrl : 'page0.html'
        }); 
    });

    // ===========================
    // Utils
    // ===========================
    var propSequence = {
        value : 0,
        reset : function() {value=0;},
        next : function() {return ++value;}
    }

    var getObjectKeys = function(object) {
        var keys = [];
        for (key in object) {
            keys.push(key);
        }
        return keys;
    }

    var addProperty = function(props, name, value, depth) {
        // Counting skips separator values (whose depth is -1)
        props.push({
            name:name,
            value:value,
            depth:depth,
            rank:depth==-1 ? -1 : propSequence.next()
        });
    }

    var concatPK = function(prefix,key) {
        return (prefix==null || prefix==undefined) ? key : prefix + '.' + key;
    }

    var flattenObjectProperties = function(props, prefix, value, depth) {
        if (value!=undefined && typeof(value)=='object') {
            var count = 0;
            for (key in value) {
                flattenObjectProperties(props, concatPK(prefix,key), value[key], 1+depth);
                count++;
            }
            // Property whose value is an empty object.
            if (count==0) {
                addProperty(props, prefix, value, depth);
            }
        } else {
            addProperty(props, prefix, value, depth);
        }
    } 

    var getManagementData = function(scope, http, resources, dataTransformation) {
        scope.data = null;
        scope.error = false;
        scope.wheel = false;

        scope.getData = function() {
            scope.wheel = true;
            var request = {
                method : 'GET',
                url : managementURL + '/' + resources
            };
            http(request).then(
                function(response) {
                    scope.data = response.data;
                    scope.error = false;
                    scope.wheel = false;
                    if (dataTransformation != null) {
                        scope.values = dataTransformation(scope.data);
                    }
                },
                function(response) {
                    scope.data = response.data;
                    scope.error = true;
                    scope.wheel = false;
                }
            );
        };

        scope.getData();
    }

    // ===========================
    // Bean Controller
    // ===========================
    app.controller('beanController', function($scope,$http) {
        getManagementData($scope,$http,'beans',null);
    });

    // ===========================
    // Health Controller
    // ===========================
    app.controller('healthController', function($scope,$http) {
        getManagementData($scope,$http,'health',null);
    });

    // ===========================
    // Metrics Controller
    // ===========================
    app.controller('metricsController', function($scope,$http) {
        getManagementData($scope,$http,'metrics',getObjectKeys);
    });

    // ===========================
    // Environment Controller
    // ===========================
    app.controller('envController', function($scope,$http) {
        getManagementData($scope,$http,'env',function(data) {
            propSequence.reset();
            var props = [];
            for (key in data) {
                var set = data[key];
                addProperty(props, key, key, -1);
                flattenObjectProperties(props, null, set, 1);
            }
            return props;
        });
    });
 
    // ===========================
    // Mappings Controller
    // ===========================
    app.controller('mappingsController', function($scope,$http) {
        getManagementData($scope,$http,'mappings',getObjectKeys);
    });

    // ===========================
    // Config Props Controller
    // ===========================
    app.controller('configpropsController', function($scope,$http) {
        getManagementData($scope,$http,'configprops',function(data) {
            propSequence.reset();
            var props = [];
            for (key in data) {
                var set = data[key];
                addProperty(props, set.prefix, key, -1);
                flattenObjectProperties(props, set.prefix, set.properties, 1);
            }
            return props;
        });
    });

    // ===========================
    // Page0 Controller
    // ===========================
    app.controller('page0Controller', function($scope,$http) {
        $scope.error = false;
    });

    // ===========================
    // Other Controller
    // ===========================
})();

// ===========================
// A few functions
// ===========================
function getManagementURL() {
    // HEROKU
    if (document.domain.endsWith('.herokuapp.com'))
        return 'https://azonzo.herokuapp.com/actuate';

    // Tomcat local, No Nginx
    if (document.URL.startsWith('http://localhost:8080/actu'))
        return 'http://localhost:8080/actu/actuate';

    // webapp runner, no Nginx
    return 'http://localhost:8080/actuate' ;
}
