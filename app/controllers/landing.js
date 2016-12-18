'use strict';

angular.module('myApp.controllers.landing', [])

// Home controller
.controller('LandingCtrl', function($scope, $rootScope, $location, firebaseData, $firebaseObject) {

    var testRef = firebase.database().ref().child('users');
    var testSyncObj = $firebaseObject(testRef);
    testSyncObj.$bindTo($scope, "testData");


    $scope.isCollapsed = true;
    if($rootScope.isAuthenticated){
        $location.url("/user");
    }
});
