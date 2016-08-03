(function() {

    var app = angular.module('actuate', ['ngRoute', 'ngCookies']);
    var adminAccessTokenValue = null;
    var adminAccessToken = null;
    var adminWriter = false;
    var managementURL = 'http://localhost:8080/actuate';

    app.config(function($routeProvider) {
        $routeProvider.when('/health',{
            templateUrl : 'health.html'
        }).when('/beans',{
            templateUrl : 'beans.html'
        }).otherwise({
            templateUrl : 'page0.html'
        }); 
    });

    // ===========================
    // Functions
    // ===========================
    var getManagementRequest = function(resources) {
        var request = {
            method : 'GET',
            url : managementURL + '/' + resources
        };
        return request;
    }

    var getManagementData = function(scope,http,resources) {
        scope.data = null;
        scope.error = false;
        scope.wheel = false;
        scope.getData = function(r) {
            var request = {
                method : 'GET',
                url : managementURL + '/' + resources
            };
            http(request).then(
                function(response) {
                    scope.data = response.data;
                    scope.wheel = false;
                },
                function(response) {
                    scope.data = null;
                    scope.wheel = false;
                    scope.error = response;
                }
            );
        };
        scope.getData(resources);
    }

    // ===========================
    // Bean Controller
    // ===========================
    app.controller('beanController', function($scope,$http) {
        $scope.beans = null;
        $scope.error = null;
        $scope.wheel = false;

        $scope.getBeans = function() {
            $scope.wheel = true;
            var request = getManagementRequest('/beans');
            $http(request).then(
                function(response) {
                    $scope.beans = response.data;
                    $scope.wheel = false;
                },
                function(response) {
                    $scope.beans = null;
                    $scope.wheel = false;
                    $scope.error = response;}
            );
        };
        $scope.getBeans();
    });

    // ===========================
    // Health Controller
    // ===========================
    app.controller('healthController', function($scope,$http) {
        $scope.health = null;
        $scope.error = null;
        $scope.wheel = false;
        $scope.getHealth = function() {
            $scope.wheel = true;
            var request = {
                method : 'GET',
                url : managementURL + '/health'
            };
            $http(request).then(
                function(response) {
                    $scope.health = response.data;
                    $scope.wheel = false;
                },
                function(response) {
                    $scope.health = null;
                    $scope.wheel = false;
                    $scope.error = response;
                }
            );
        };
        $scope.getHealth();
    });

 
    // ===========================
    // Page0 Controller
    // ===========================
    app.controller('page0Controller', function($scope,$http,$cookies) {
        $scope.error = false;
        $scope.data = null;
        $scope.token = $cookies.get('ADMIN_ACCESS_TOKEN');
        adminAccessTokenValue = $scope.token;

        var request = {
            method : 'GET',
            url : managementURL + '/oauth/check_token?token=' + adminAccessTokenValue,
            headers : {'Authorization' : 'Basic Y2xpZW50MDpQQDU1dzByZDA='}
        };
        $http(request).then(
            function(response) {
                $scope.data = response.data;
                $scope.error = false;
                adminAccessToken = response.data;
                adminWriter = canWrite(adminAccessToken);
            },
            function(response) {
                $scope.data = response.data;
                $scope.error = true;
                adminAccessToken = null;
                adminWriter = false;
            }
        );

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

function formatError(response) {
    return 'ERROR ' + response.status + ' ' + response.data.error_description;
}

function canWrite(token) {
    var scopes = token.scope;
    for (i=0; i<scopes.length; i++) {
        if ('ADMIN_WRITE' == scopes[i]) return true;
    }
    return false;
}






