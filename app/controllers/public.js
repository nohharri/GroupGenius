'use strict';
angular.module('myApp.controllers.public', [])

// Homepage controller
.controller('PublicCtrl', function($scope, $rootScope, firebaseData, headerService) {
     $scope.isCollapsed = true;
     $scope.allGroups = groups;
     $scope.updateGroup = function(name, desc, members, spots) {
     	$scope.currentGroup = name;
     	$scope.currentMembers = 'Current Members: ' + formatMembers(members);
     	$scope.openSpots = 'Open Spots: ' + spots;
     	$scope.desc = 'Description: ' + desc;
     };
     $scope.formatMembers = function(members) {
		var s = ' ';
		for( var i = 0; i < members.length; ++i) {
			
			s += members[i];
			if( i < members.length - 1)
				s += ", ";
		}

		return s;
	};
    //åheaderService.set("different");
});


var groups = [
	{ "name": "Group #1", "desc": "Desc", "members": ["Dina Rudelston", "Megan Helena"], "spots": 4},
	{ "name": "Group #2", "desc": "Desc2", "members": ["Lise Gorelick", "Mav the Maverick"], "spots": 3}
];

