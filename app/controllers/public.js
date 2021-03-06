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
	$scope.isSelected = function(id){
		if(id == $scope.currentGroup){ return true; } else { return false; }
	}
	$scope.userIDtoname = {};
	$scope.nametoemail = {};
	$scope.userIDtohash = {};
	$scope.currEmails = [];
	$scope.unlChecked = true;
	$scope.groupId;
	$scope.currPending = false;
	$scope.currMember = false;
	$scope.createUserHashMap = function(){
		$http({
			method: 'GET',
			url: 'https://groupgenius-5953b.firebaseio.com/users.json'
		}).then(function successCallback(response) {
			for(var key in response.data){
				$scope.userIDtoname[response.data[key].uid] = key;
				$scope.userIDtoname[response.data[key].uid] = response.data[key].firstName + " " + response.data[key].lastName;
				$scope.nametoemail[response.data[key].firstName + " " + response.data[key].lastName] = response.data[key].email;
			}
			for(var c = 0; c < $scope.allGroups.length; c++){
				for(var d in $scope.allGroups[c].members){
					$scope.allGroups[c].members[d] = $scope.userIDtoname[$scope.allGroups[c].members[d]];
				}
			}
			console.log($scope.allGroups);
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
		if($scope.groupId == null || $scope.groupId == 0){
			return;
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

	$scope.updateGroup = function(groupId, name, desc, members, spots, comments, approval, noti) {
		$scope.selected = true;
		$scope.currPending = false;
		if(noti != null && noti.joinRequest != null){
			for(var key in noti.joinRequest){
				if(key == firebase.auth().currentUser.uid){
					$scope.currPending = true;
				}
			}
		}		
		$scope.currMember = false;
		for(var c in members){
			if(members[c] == $scope.userIDtoname[firebase.auth().currentUser.uid]){
				$scope.currMember = true;
				$scope.currPending = false;
			}
		}
		$scope.groupId = groupId;
		$scope.currentGroup = name;
		$scope.currentMembers = $scope.formatMembers(members);
		$scope.currentComments = comments;
		$scope.approvalSetting = approval;
		
		if(spots == -1) {
			$scope.openSpots = 'Open Spots: Unlimited';
		} else {
	 		$scope.openSpots = 'Open Spots: ' + spots;
		}
		$scope.desc = desc;

	}
	
	$scope.selCls = function(clas) {
		$scope.currentClass = clas;
	}
	
	$scope.formatMembers = function(members) {
		var s = ' ';
		var ij = Object.keys(members).length;
		for( var i in members) {
			s += members[i];
			if(ij > 1){
				s += ", ";
			}
			ij--;
		}
		return s;
	}
	$scope.approveCheckBox = false;
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

		var killme = "on";
		if(!$scope.approveCheckBox){
			killme = "off";
		}
		$scope.currentClass = document.getElementById("orgSelect").value;
		$scope.writeNewPost($scope.newName, $scope.newDesc, numSpots, document.getElementById("orgSelect").value, killme);

	}
	$scope.isCurClass = function(clas){
		if(clas == $scope.currentClass){ return true; } else { return false }
	}
	$scope.writeNewPost = function(name, desc, spots, org, mustApprove) {

		console.log("writing a new post");

		var members = {};
		//add the creator of the group to the members
		members[$scope.userIDtohash[firebase.auth().currentUser.uid]] = firebase.auth().currentUser.uid;

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
	  var chatRef = firebase.database().ref('/chat/' + newPostKey);
	  var keyName = chatRef.push({
	  	name: 'GeniusBot',
	  	text: 'Welcome to the chat! Type something in the chat to get started.'
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
		var userId = firebase.auth().currentUser.uid;
		var username = $rootScope.curUsername;
		// Send join request if group is not open
		if ($scope.approvalSetting == "on" && !$scope.currMember)
		{
			var newKey = userId;
			var updateNotif = {};
			
			updateNotif['/groups/' + $scope.groupId + '/notifications/joinRequest/' + newKey] = username + " asked to join the group";
			firebase.database().ref().update(updateNotif);
			$scope.currPending = true; // make request pending btn show up
		}

		else // add and take to private group
		{
			var update = {};
			
			// push user to members
			firebase.database().ref().child('/groups/' + $scope.groupId + '/members').push(userId);
			
			update['/groups/' + $scope.groupId + '/notifications/logistics/' + userId] = username + " joined the group";
			firebase.database().ref().update(update);
			window.location.href = '/#/private?groupId=' + $scope.groupId;	
		}
	}




});



/*

/groups (list of groups)
	/groupId (a certain group object)
		/currentMembers (list of user objects)
			/userID (a certain user object)
				/name
				



*/



