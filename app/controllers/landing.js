'use strict';

angular.module('myApp.controllers.landing', [])

// Home controller
.controller('LandingCtrl', function($scope, $rootScope, firebaseData) {
     $scope.isCollapsed = true;
});
