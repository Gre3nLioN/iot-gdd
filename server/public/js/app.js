var App = angular.module('iot', ['ngRoute']);

App.config(['$routeProvider', '$locationProvider',
    function($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: '/views/index.html',
                controller: 'mainCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
]);

