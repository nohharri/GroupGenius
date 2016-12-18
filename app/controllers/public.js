'use strict';
angular.module('myApp.controllers.public', [])

// Homepage controller
.controller('PublicCtrl', function($scope, $rootScope, firebaseData, headerService, $http, $location) {
  	$scope.allGroups = [];
	$scope.selected = false;
    $scope.allGroupsRef = firebase.database().ref('groups');
	$scope.clearForm = function(){
		$scope.newName = "";
		$scope.newDesc = "";
		$scope.unlChecked = true;
	}
	$scope.userIDtoname = {};
	$scope.nametoemail = {};
	$scope.currEmails = [];
	$scope.unlChecked = true;
	$scope.groupId;

	$scope.createUserHashMap = function(){
		$http({
			method: 'GET',
			url: 'https://groupgenius-5953b.firebaseio.com/users.json'
		}).then(function successCallback(response) {
			for(var key in response.data){
				$scope.userIDtoname[response.data[key].uid] = response.data[key].firstName + " " + response.data[key].lastName;
				$scope.nametoemail[response.data[key].firstName + " " + response.data[key].lastName] = response.data[key].email;
			}
			for(var c = 0; c < $scope.allGroups.length; c++){
				for(var d= 0; d < $scope.allGroups[c].members.length; ++d){
				
					$scope.allGroups[c].members[d] = $scope.userIDtoname[$scope.allGroups[c].members[d]];
				}
			}
		});
	}
    //event listener that updates when groups are added to the database
    $scope.allGroupsRef.on('value', function(snapshot) {
    	console.log("groups updated");
    	//console.log(snapshot.val());
    	var groupObj = snapshot.val();
	$scope.allGroups = [];
    	for( var key in groupObj) {
    		var group = groupObj[key];
    		group.groupid = key;
    		$scope.allGroups.push(group);
    	}
		$scope.createUserHashMap();
        //Apply causing issues. Commented out for now and everything seems to be working okay.
    	// $scope.$apply();
    	//console.log($scope.allGroups);

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
	$scope.currentComments = [];
	
	$scope.postCmt = function(){
		if($scope.currentComments == null){
			$scope.currentComments = [];
		}
		$scope.currentComments.push({"name": $scope.userIDtoname[firebase.auth().currentUser.uid], "user": firebase.auth().currentUser.uid, "comment": $scope.userComment});
		// put to groups/id/comments.json
		console.log('putting to' + 'https://groupgenius-5953b.firebaseio.com/groups/' + $scope.groupId + "/comments.json");
		$scope.userComment = "";
		$http({
			method: 'PUT',
			url: 'https://groupgenius-5953b.firebaseio.com/groups/' + $scope.groupId + "/comments.json",
			data: $scope.currentComments
			}).then(function successCallback(response){
			console.log(response.data);
		});
		//console.log($scope.allGroups);
	}

	$scope.isActiveClass = function(clas){
		if($scope.currentClass == clas) {
			return true;
		}
		return false;
	}

	$scope.updateGroup = function(groupId, name, desc, members, spots, comments) {
		$scope.selected = true;
		$scope.currentGroup = name;
		$scope.currentMembers = $scope.formatMembers(members);
		$scope.currentComments = comments;
		
		if(spots == -1) {
			$scope.openSpots = 'Open Spots: Unlimited';
		} else {
	 		$scope.openSpots = 'Open Spots: ' + spots;
		}
		$scope.desc = desc;

		console.log(groupId);
		$scope.groupId = groupId;
	}
	
	$scope.selCls = function(clas) {
		$scope.currentClass = clas;
	}
	
	$scope.formatMembers = function(members) {
		var s = ' ';
		for( var i = 0; i < members.length; ++i) {
			s += members[i];
			if( i < members.length - 1) {
				s += ", ";
			}
		}
		return s;
	}

	$scope.createNewGroup = function() {
		console.log("create new group");
		if(!$scope.newName || !$scope.newDesc) {
			alert("You must designate a name and description. Your group has NOT been created!");
			return;
		}

		var numSpots = 0;
		if($scope.unlChecked) {
			numSpots = -1;
		} else {
			numSpots = $("#limitSelect").val();
		}


		$scope.currentClass = document.getElementById("orgSelect").value;
		$scope.writeNewPost($scope.newName, $scope.newDesc, numSpots, document.getElementById("orgSelect").value, $("#approveCheckBox").val());

	}

	$scope.writeNewPost = function(name, desc, spots, org, mustApprove) {

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
		groupId: 0 // null at first
	  };

	  // Get a key for a new Post.
	  var newPostKey = firebase.database().ref().child('groups').push().key;

	  // Create default chat
	  var chatRef = firebase.database().ref('/chat/' + newPostKey + '/' + 'General');
	  var keyName = chatRef.push({
	  	name: 'Chatbot',
	  	text: 'Welcome to the stream!'
	  });

	  // Write the new post's data simultaneously in the posts list and the user's post list.
	  var updates = {};
	  newGroup['groupId'] = newPostKey; // update groupId
	  //write the group to the group list
	  updates['/groups/' + newPostKey] = newGroup;
	 
	  firebase.database().ref().update(updates);

	  //window.location.href = '/app/#/private?groupId=' + newPostKey;
	}

	$scope.joinGroup = function() {
		window.location.href = '/app/#/private?groupId=' + $scope.groupId;	
	}
    
});



/*

/groups (list of groups)
	/groupId (a certain group object)
		/currentMembers (list of user objects)
			/userID (a certain user object)
				/name
				



*/



