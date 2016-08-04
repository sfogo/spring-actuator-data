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
    var configPropsSequence = {
        value : 0,
        reset : function() {value=0;},
        next : function() {return ++value;}
    }

    var addConfigProperty = function(props, name, value, depth) {
        // Counting skips separator values (whose depth is -1)
        props.push({
            name:name,
            value:value,
            depth:depth,
            rank:depth==-1 ? -1 : configPropsSequence.next()
        });
    }

    var getObjectKeys = function(data) {
        var keys = [];
        for (key in data) {
            keys.push(key);
        }
        return keys;
    }

    var flattenConfigProps = function(data) {
        configPropsSequence.reset();
        var props = [];
        for (key in data) {
            var set = data[key];
            addConfigProperty(props, set.prefix, key, -1);
            flattenObjectProperties(props, set.prefix, set.properties, 1);
        }
        return props;
    }

    var flattenObjectProperties = function(props, prefix, value, depth) {
        if (value!=undefined && typeof(value)=='object') {
            var count = 0;
            for (key in value) {
                flattenObjectProperties(props, prefix+'.'+key, value[key], 1+depth);
                count++;
            }
            // Property whose value is an empty object.
            if (count==0) {
                addConfigProperty(props, prefix, value, depth);
            }
        } else {
            addConfigProperty(props, prefix, value, depth);
        }
    } 

    var getManagementData = function(scope, http, resources, dataTransform) {
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
                    if (dataTransform != null) {
                        scope.values = dataTransform(scope.data);
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
        getManagementData($scope,$http,'env',getObjectKeys);
        $scope.getEnvKeys = function(object) {return getObjectKeys(object);}
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
        getManagementData($scope,$http,'configprops',flattenConfigProps);
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
