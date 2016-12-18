'use strict';

angular.module('myApp.controllers.user', ['ngAnimate'])

// Homepage controller
.controller('UserCtrl', function($scope, $rootScope, firebaseData, $http) {
	 $scope.isCollapsed = true;
	 $rootScope.curUsername = $scope.curUsername;
	 
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
			var key, pageData = {}, pendingGroups =[];
			var userId =  firebase.auth().currentUser.uid;
			// Create object of orgs with array of groups for each org
			for (key in response)
			{
				if ($scope.search(response[key].members, userId) != -1)
				{
						if (pageData[response[key].org]) // add another group to org
							pageData[response[key].org].push(response[key]);
						else // add first group to org
							pageData[response[key].org] = [response[key]];
				}
				else // get groups that current user has requested to join
				{
					// if notification->joinRequest exits
					if (response[key].notifications && response[key].notifications.joinRequest)
					{
						if (response[key].notifications.joinRequest[userId]) //user has requested to be in this group
								pendingGroups.push(response[key]);
					}
				}
			}
			console.log(pageData);
			$scope.pageData = pageData;
			$scope.pendingGroups = pendingGroups;
		});
		
	};



	$scope.approve = function(groupId, userId)
	{
		// add to members
		firebase.database().ref().child('/groups/' + groupId + '/members').push(userId);
		// remove from joinRequest
		firebase.database().ref().child('/groups/' + groupId + '/notifications/joinRequest/' + userId).remove();
	}

	$scope.removeNotification = function(groupId, userId, type)
	{
		firebase.database().ref().child('/groups/' + groupId + '/notifications/' + type + '/' + userId).remove();
	}

	$scope.leaveGroup = function(orgId, groupKey, groupId)
	{
		var curUser = firebase.auth().currentUser.uid;
		var group = $scope.pageData[orgId][groupKey];
		var userKey;

		var count = 0;
		for (var memb in group['members']) //loop through memebers to get key of user
		{
			if (group['members'][memb] == curUser)
				userKey = memb;
			count++;
		}

		//remove group from pageData
		delete $scope.pageData[orgId][groupKey];
		// handle last group in org
		var groupCount = 0;
		for (var key in $scope.pageData[orgId]) //because .length doesnt work
			groupCount++;
		if (groupCount == 0)
			delete $scope.pageData[orgId];

		// firebase
		if (count <= 1) //only one member left, delete group
				firebase.database().ref().child('/groups/' + groupId).remove();		
		else
			firebase.database().ref().child('/groups/' + groupId + '/members/' + userKey).remove();
	}


	$scope.parseNotifications = function(rawNotifications)
	{
			var logs = [];
			for (var key in rawNotifications)
				logs.push(rawNotifications[key]);
			return $scope.current_notif = logs;
	};

	// Goes through a notifcatinos object and gives back a tuple of [type, text]
	$scope.parseAllNotifications = function(raw)
	{
		var notification = [];
		for (var notifType in raw)
		{
			for (var notif in raw[notifType])
				notification.push([notifType, raw[notifType][notif], notif]) //ex: joinRequest, 'mav asked to join', userId
		}
		return notification;
	}
	$scope.sizeOf = function(inObj)
	{
		return inObj.length;
	}
	// function for searching data for value. returns false if nothing found, else returns the key
	$scope.search = function(arr, target) { 
		var key;
		for (key in arr)
		{
			if (arr[key] == target)
				return key;
		}
		return -1;
	};
});

