'use strict';

angular.module('myApp.controllers.user', [])

// Homepage controller
.controller('UserCtrl', function($scope, $rootScope, firebaseData) {
	 $scope.isCollapsed = true;
	 $scope.scrollTo = function (target){
		var container = $('#wrapper-main'), scrollTo = $(target);
		container.animate({
			scrollTop: scrollTo.offset().top - container.offset().top + container.scrollTop() 
		});
	}
});

