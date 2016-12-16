'use strict';
angular.module('myApp.controllers.public', [])

// Homepage controller
.controller('PublicCtrl', function($scope, $rootScope, firebaseData, headerService) {
     $scope.isCollapsed = true;
     $scope.allGroups = groups;
<<<<<<< HEAD
	$scope.currentGroup = "Select a Group!"
=======
     $scope.updateGroup = function(name, desc, members, spots) {
     	$scope.currentGroup = name;
     	$scope.currentMembers = 'Current Members: ' + $scope.formatMembers(members);
     	$scope.openSpots = 'Open Spots: ' + spots;
     	$scope.desc = 'Description: ' + desc;
     };
>>>>>>> 8fecd6193dfb9ff70ac4d829c4174e1ad001747f
     $scope.formatMembers = function(members) {
		var s = ' ';
		for( var i = 0; i < members.length; ++i) {
			
			s += members[i];
			if( i < members.length - 1)
				s += ", ";
		}

		return s;
	};
     $scope.updateGroup = function(name, desc, members, spots) {
     	$scope.currentGroup = name;
     	$scope.currentMembers = 'Current Members: ' + $scope.formatMembers(members);
     	$scope.openSpots = 'Open Spots: ' + spots;
     	$scope.desc = 'Description: ' + desc;
     };
    //åheaderService.set("different");
});


var groups = [
	{ "name": "Group #1", "desc": "orem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ante velit, faucibus vitae lacus ut, pellentesque venenatis lorem. Cras condimentum sodales posuere. In accumsan lorem vel posuere mollis. Sed non convallis sem. In ornare eros et fringilla fringilla. Proin tincidunt ipsum vel dui congue, in fringilla tortor cursus. Nullam feugiat lectus nec dui consectetur, in elementum massa finibus. Etiam accumsan nisl velit, a auctor sapien consectetur eget. Integer eu neque ante. Aliquam at justo non elit porttitor mattis vel ac velit.", "members": ["Dina Rudelston", "Megan Helena"], "spots": 4},
	{ "name": "Group #2", "desc": "Desc2", "members": ["Lise Gorelick", "Mav the Maverick"], "spots": 3}
];

