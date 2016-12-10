'use strict';

angular.module('myApp.controllers.user', [])

// Homepage controller
.controller('UserCtrl', function($scope, $rootScope, firebaseData) {
     $scope.isCollapsed = true;
});