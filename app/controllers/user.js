'use strict';

angular.module('myApp.controllers.user', [])

// Homepage controller
.controller('UserCtrl', function($scope, $rootScope, firebaseData, $http) {
	 $scope.isCollapsed = true;

	 // Fix for not being able to use anchors
	 $scope.scrollTo = function (target)
	 {
		var container = $('#wrapper-main'), scrollTo = $('#' + target);
		container.animate({
			scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop() 
		});
	}


	// Grabs data from firebase like username and the groups they are in
	$scope.getData = function()
	{
		var data = [];
		$http.get('https://groupgenius-5953b.firebaseio.com/groups.json').success(function (response) {
			console.log(response);
			$scope.userData = response;
		});
	};

});

