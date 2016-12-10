'use strict';

angular.module('myApp.controllers.public', [])

// Homepage controller
.controller('PublicCtrl', function($scope, $rootScope, firebaseData) {
     $scope.isCollapsed = true;
});