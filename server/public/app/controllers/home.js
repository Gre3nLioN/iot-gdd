'use strict';

/* Controllers */
angular.module('ssApp.controllers')
  .controller('homeController', function($scope, $routeParams, $location, $route) {
    $scope.cities = [
        {'class': 'ba', 'name': 'Buenos Aires', 'endpoint' :'ba'}
      ];
 });
