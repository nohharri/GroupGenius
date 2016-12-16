'use strict';
angular.module('myApp.controllers.public', [])

// Homepage controller
.controller('PublicCtrl', function($scope, $rootScope, firebaseData, headerService) {
  
  	$scope.allGroups = [];
 //    $scope.allGroupsRef = firebase.database().ref('groups');

 //    //event listener that updates when groups are added to the database
 //    $scope.allGroupsRef.on('value', function(snapshot) {
 //    	console.log("groups updated");
 //    	console.log(snapshot.val());
 //    	$scope.allGroups = snapshot.val();
	// });


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

  // A post entry.
  var newGroup = {
    name: name,
    desc: desc,
    members: members,
    spots: spots,
    mustApprove: mustApprove,
    org: org
  };

  // Get a key for a new Post.
  var newPostKey = firebase.database().ref().child('groups').push().key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  //write the group to the group list
  updates['/groups/' + newPostKey] = newGroup;
 
  return firebase.database().ref().update(updates);
}

