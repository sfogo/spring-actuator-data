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
    // Functions
    // ===========================
    var getObjectKeys = function(object) {
        var keys = [];
        for (key in object) {
            keys.push(key);
        }
        return keys;
    }

    var flattenConfigProps = function(data) {
        var props = [];
        for (key in data) {
            var set = data[key];
            props.push({name:key,value:'_set_'});
            flattenProperties(props,set.prefix,set.properties);
        }
        return props;
    }

    var getManagementData = function(scope,http,resources,dataTransform) {
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
        scope.getData(resources);
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
// HTTP Management
// ===========================
function getQueryParameter(url,name) {
    var r = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
    return r==null ? null : decodeURIComponent(r[1]);
}

function removeQuery(url) {
    var i=url.indexOf('?');
    return (i==-1) ? url : url.substring(0,i);
}

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

function flattenProperties(props,prefix,value) {
    if (value!=undefined && typeof(value)=='object') {
        var count = 0;
        for (key in value) {
            flattenProperties(props,prefix+'.'+key,value[key]);
            count++;
        }
        // We want to see empty properties.
        if (count==0) {
            props.push({name : prefix, value : value});
        }
    } else {
        props.push({name : prefix, value : value});
    }
} 
