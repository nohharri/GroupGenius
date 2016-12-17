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
		$http.get('https://groupgenius-5953b.firebaseio.com/groups.json').success(function (response) {
			var key, pageData = {};
			var userId =  firebase.auth().currentUser.uid;
			// Create object of orgs with array of groups for each org
			for (key in response)
			{
				if (response[key].members.indexOf(userId) != -1)
				{
						if (pageData[response[key].org]) // add another group to org
							pageData[response[key].org].push(response[key]);
						else // add first group to org
							pageData[response[key].org] = [response[key]];
				}
			}
			console.log(pageData);
			$scope.pageData = pageData;
		});
	};

});

