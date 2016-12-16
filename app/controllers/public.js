'use strict';
angular.module('myApp.controllers.public', [])

// Homepage controller
.controller('PublicCtrl', function($scope, $rootScope, firebaseData, headerService) {
     $scope.isCollapsed = true;
     $scope.allGroups = groups;
	$scope.classes = ["EECS 482", "EECS 485"];
	$scope.currentClass = $scope.classes[0];
	$scope.currentGroup = "Select a Group!"
	$scope.isActiveClass = function(clas){
		if($scope.currentClass == clas){
			return true;
		} return false;
		}
     $scope.updateGroup = function(name, desc, members, spots) {
     	$scope.currentGroup = name;
     	$scope.currentMembers = 'Current Members: ' + $scope.formatMembers(members);
     	$scope.openSpots = 'Open Spots: ' + spots;
     	$scope.desc = 'Description: ' + desc;
     };
	$scope.selCls = function(clas) {
		$scope.currentClass = clas;
	}
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

	{ "name": "Group #1", "desc": "orem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ante velit, faucibus vitae lacus ut, pellentesque venenatis lorem. Cras condimentum sodales posuere. In accumsan lorem vel posuere mollis. Sed non convallis sem. In ornare eros et fringilla fringilla. Proin tincidunt ipsum vel dui congue, in fringilla tortor cursus. Nullam feugiat lectus nec dui consectetur, in elementum massa finibus. Etiam accumsan nisl velit, a auctor sapien consectetur eget. Integer eu neque ante. Aliquam at justo non elit porttitor mattis vel ac velit.", "members": ["Dina Rudelston", "Megan Helena"], "spots": 4, "org": "EECS 485"},
	{ "name": "Group #2", "desc": "Desc2", "members": ["Lise Gorelick", "Mav the Maverick"], "spots": 3, "org":"EECS 482"},
	{ "name": "Group #2", "desc": "This group has pizza", "members": ["Lise Gorelick", "Mav the Maverick"], "spots": 3, "org":"EECS 482"}
];

