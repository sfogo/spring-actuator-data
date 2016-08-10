(function() {

    var app = angular.module('actuate', ['ngRoute']);
    var managementContextPath = '/actuate';
    var managementURL = localManagementURL();

    app.config(function($routeProvider) {
        $routeProvider
            .when('/health', {templateUrl : 'health.html'})
            .when('/metrics',{templateUrl : 'metrics.html'})
            .when('/beans',  {templateUrl : 'beans.html'})
            .when('/env',    {templateUrl : 'env.html'})
            .when('/mappings',   {templateUrl : 'mappings.html'})
            .when('/configprops',{templateUrl : 'configprops.html'})
            .when('/genericget', {templateUrl : 'genericget.html'})
            .otherwise({templateUrl : 'page0.html'}); 
    });

    // ===========================
    // Utils
    // ===========================
    var propSequence = {
        value : 0,
        reset : function() {value=0;},
        next : function() {return ++value;}
    };

    var getObjectKeys = function(object) {
        var keys = [];
        for (var key in object) {
            keys.push(key);
        }
        return keys;
    };

    var addProperty = function(props, name, value, depth) {
        // Counting skips separator values (whose depth is -1)
        props.push({
            name:name,
            value:value,
            depth:depth,
            rank:depth==-1 ? -1 : propSequence.next()
        });
    };

    var concatPK = function(prefix,key) {
        return (prefix==null || prefix==undefined) ? key : prefix + '.' + key;
    };

    var flattenObjectProperties = function(props, prefix, value, depth) {
        if (value!=undefined && typeof(value)=='object') {
            var count = 0;
            for (var key in value) {
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
    };

    var objectIsConfigPropsSet = function(o) {
        return typeof(o)=='object' && o.hasOwnProperty('prefix') && o.hasOwnProperty('properties');   
    };

    var flattenConfigProperties = function(props, data, parent) {
        if (objectIsConfigPropsSet(data)) {
            addProperty(props, data.prefix, parent, -1);
            flattenObjectProperties(props, data.prefix, data.properties, 1);
        } else for (var key in data) {
            flattenConfigProperties(props, data[key], concatPK(parent,key))
        }
    };

    var getActuatorData = function(scope, http, resource) {
        scope.url = managementURL + '/' + resource;
        scope.data = null;
        scope.error = false;
        scope.wheel = true;
        var request = {
            method : 'GET',
            url : scope.url
        };
        http(request).then(
            function(response) {
                scope.data = response.data;
                scope.error = false;
                scope.wheel = false;
                if (scope.dataTransformation) {
                    scope.values = scope.dataTransformation(scope.data);
                }
            },
            function(response) {
                scope.data = response.data;
                scope.error = true;
                scope.wheel = false;
                if (scope.transformError && scope.dataTransformation) {
                    scope.values = scope.dataTransformation(scope.data);
                }
            }
        );
    };

    // ===========================
    // Health Controller
    // ===========================
    app.controller('healthController', function($scope,$http) {
        $scope.transformError = true;
        $scope.dataTransformation = function(data) {
            propSequence.reset();
            var props = [];
            flattenObjectProperties(props, null, data, 1);
            return props;
        };

        getActuatorData($scope,$http,'health');
    });

    // ===========================
    // Bean Controller
    // ===========================
    app.controller('beanController', function($scope,$http) {
        getActuatorData($scope,$http,'beans');
    });

    // ===========================
    // Metrics Controller
    // ===========================
    app.controller('metricsController', function($scope,$http) {
        $scope.dataTransformation = getObjectKeys;
        getActuatorData($scope,$http,'metrics');
    });

    // ===========================
    // Mappings Controller
    // ===========================
    app.controller('mappingsController', function($scope,$http) {
        $scope.dataTransformation = getObjectKeys;
        getActuatorData($scope,$http,'mappings');
    });

    // ===========================
    // Generic GET Controller :
    // Get actuator mappings and
    // present them in dropdown
    // of genericget.html
    // ===========================
    app.controller('genericgetController', function($scope,$http) {
        $scope.dataTransformation = function(data) {
            propSequence.reset();
            var props = [];
            for (var key in data) {
                // key sample :
                // {[/actuate/env || /actuate/env.json],methods=[GET],produces=[application/json]}
                if (key.indexOf('methods=[GET]') > 0 &&
                    key.indexOf('application/octet-stream')==-1) {
                    var b = key.indexOf('[');
                    var e = key.indexOf(']');
                    if (b>=0 && e>b) {
                        var paths = key.substring(1+b,e).split(' || '); 
                        for (var p in paths) {
                            props.push({path:paths[p],method:'GET'});
                        }
                    }
                }
            }
            return props;
        };

        $scope.doGet = function() {
            var request = {method:'GET',url:$scope.inputURL};
            $http(request).then(
                function(response) {$scope.response = response;},
                function(response) {$scope.response = response;}
            );
        };

        $scope.selectedPath=managementContextPath+'/info';
        $scope.baseURL = getBaseURL(managementURL,managementContextPath);
        $scope.response = {};
        $scope.getDataURL = function () {return $scope.baseURL + $scope.selectedPath;};
        $scope.setInputURL = function() {$scope.inputURL = $scope.getDataURL();};
        $scope.setInputURL();
        getActuatorData($scope,$http,'mappings');
    });

    // ===========================
    // Environment Controller
    // ===========================
    app.controller('envController', function($scope,$http) {
        $scope.dataTransformation = function(data) {
            propSequence.reset();
            var props = [];
            for (var key in data) {
                var set = data[key];
                addProperty(props, key, key, -1);
                flattenObjectProperties(props, null, set, 1);
            }
            return props;
        };
        getActuatorData($scope,$http,'env');
    });
 
    // ===========================
    // Config Props Controller
    // ===========================
    app.controller('configpropsController', function($scope,$http) {
        $scope.dataTransformation = function(data) {
            propSequence.reset();
            var props = [];
            flattenConfigProperties(props,data,null);
            return props;
        };
        getActuatorData($scope,$http,'configprops');
    });

    // ===========================
    // Page0 Controller
    // ===========================
    app.controller('page0Controller', function($scope,$http) {
        $scope.actuateURL = managementURL;
        $scope.setManagementURL = function() {
            managementURL = $scope.actuateURL;
            $scope.findManagenentContextPath();
        };
        $scope.localReset = function() {
            managementURL = localManagementURL();
            $scope.actuateURL = managementURL;
            $scope.findManagenentContextPath();
        };
        $scope.findManagenentContextPath = function() {
            var key = 'management.context-path';
            var request = {method:'GET',url:managementURL+'/env/'+key};
            $scope.warning=undefined; 
            $http(request).then(
                function(response) {managementContextPath=response.data[key];},
                function(response) {$scope.warning='This does not appear to be an Actuate URL';}
            );
        };
    });

    // ===========================
    // Other Controller
    // ===========================
})();

// ===========================
// A few functions
// ===========================
function getBaseURL(mu,mp) {
    var n = mu.indexOf(mp);
    return (n>=0) ? mu.substring(0,n) : mu;
}

function localBaseURL() {
    // HEROKU
    if (document.domain.endsWith('.herokuapp.com'))
        return 'https://azonzo.herokuapp.com';

    // Tomcat local, No Nginx
    if (document.URL.startsWith('http://localhost:8080/actu'))
        return 'http://localhost:8080/actu';

    // webapp runner, no Nginx
    return 'http://localhost:8080' ;
}

function localManagementURL() {
    return localBaseURL() + '/actuate'; 
}
