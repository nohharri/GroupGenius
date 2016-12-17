'use strict';
angular.module('myApp.controllers.public', [])

// Homepage controller
.controller('PublicCtrl', function($scope, $rootScope, firebaseData, headerService, $http) {
  
  	$scope.allGroups = [];
	$scope.selected = false;
    $scope.allGroupsRef = firebase.database().ref('groups');

    //event listener that updates when groups are added to the database
    $scope.allGroupsRef.on('value', function(snapshot) {
    	console.log("groups updated");
    	console.log(snapshot.val());
    	var groupObj = snapshot.val();
	$scope.allGroups = [];
    	for( var key in groupObj) {
    		var group = groupObj[key];
    		group.groupid = key;
    		$scope.allGroups.push(group);
    	}
    	$scope.$apply();
    	console.log($scope.allGroups);

	});
	$scope.classes = [];
	
	$scope.getClasses = function()
	{
		$http.get('https://groupgenius-5953b.firebaseio.com/organizations.json').success(
			function (response) { $scope.classes  = response; $scope.currentClass = $scope.classes[0]});
	}
	$scope.getClasses();
	$scope.currentClass = $scope.classes[0];
	$scope.currentGroup = "Select a Group!"
	$scope.isActiveClass = function(clas){
		if($scope.currentClass == clas){
			return true;
		} return false;
		}
     $scope.updateGroup = function(name, desc, members, spots) {
	$scope.selected = true;
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

		console.log("create new group");
		if(!$scope.newName || !$scope.newDesc) {
			alert("You must designate a name and description. Your group has NOT been created!");
			return;
		}

		var numSpots = 0;
		if($("#limitSelect").val() == "no limit") {
			numSpots = -1;
		} else {
			numSpots = $("#limitSelect").val();
		}


		$scope.currentClass = document.getElementById("orgSelect").value;
		writeNewPost($scope.newName, $scope.newDesc, numSpots, document.getElementById("orgSelect").value, $("#approveCheckBox").val());

	}
    
});



/*

/groups (list of groups)
	/groupId (a certain group object)
		/currentMembers (list of user objects)
			/userID (a certain user object)
				/name
				



*/

function writeNewPost(name, desc, spots, org, mustApprove) {

	console.log("writing a new post");

	var members = [];
	//add the creator of the group to the members
	members.push(firebase.auth().currentUser.uid);
	
	// Generate group id (new groupId = number of groups + 1)
	var groupId = 0;
	$.ajax({
		dataType: 'JSON',
		url: 'https://groupgenius-5953b.firebaseio.com/groups.json',
		success: function(resp) {groupId = Object.keys(resp).length + 1},
		async: false // need to wait for response
	});
  // A post entry.
  var newGroup = {
    name: name,
    desc: desc,
    members: members,
    spots: spots,
    mustApprove: mustApprove,
    org: org,
	groupId: groupId
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('groups').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  //write the group to the group list
  updates['/groups/' + newPostKey] = newGroup;
 
  return firebase.database().ref().update(updates);
}

