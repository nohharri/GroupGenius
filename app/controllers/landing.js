'use strict';

angular.module('myApp.controllers.landing', [])

// Home controller
.controller('LandingCtrl', function($scope, $rootScope, $location, firebaseData) {
     $scope.isCollapsed = true;
     if($rootScope.isAuthenticated){
        $location.url("/user");
     }
});
