'use strict';
angular.module('myApp.controllers.public', [])

// Homepage controller
.controller('PublicCtrl', function($scope, $rootScope, firebaseData, headerService) {
     $scope.isCollapsed = true;
     $scope.allGroups = groups;
     $scope.updateGroup = function(name, desc, members, spots) {
     	$scope.currentGroup = name;
     	$scope.currentMembers = 'Current Members: ' + $scope.formatMembers(members);
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



	$scope.createNewGroup = function() {

		if(!$scope.newName || !$scope.newDesc) {
			alert("You must designate a name and description. Your group has NOT been created!");
			return;
		}

		var newGroup = {};
		newGroup.org = $("#orgSelect").val();
		newGroup.name = $scope.newName;
		newGroup.desc = $scope.newDesc;
	
		if($("#limitSelect").val() == "no limit") {
			newGroup.spots = "unlimited";
		} else {
			newGroup.spots = $("#limitSelect").val();
		}
		groups.push(newGroup);

		//REMEMBER TO ADD THE PERSON CREATING THE GROUP!!!
		newGroup.members = [];


	}
    
});


var groups = [
	{ "org": "EECS 482", "name": "Group #1", "desc": "Desc", "members": ["Dina Rudelston", "Megan Helena"], "spots": 4},
	{ "org": "EECS 482", "name": "Group #2", "desc": "Desc2", "members": ["Lise Gorelick", "Mav the Maverick"], "spots": 3}
];













