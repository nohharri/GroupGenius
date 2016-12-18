'use strict';

angular.module('myApp.controllers.private', [])

// Homepage controller
.controller('PrivateCtrl', function($scope, $rootScope, firebaseData, $location, $http) {
    $scope.isCollapsed = true;
    $scope.messages = [];
    $scope.messageText = "";


    $scope.groupId = 'KZ9a5HqDVn80zsXglLD';

    var firepadRef = firebaseData.database().ref('/docs/' + $scope.groupId + '/');
    var codeMirror = CodeMirror(document.getElementById('wrapper-document'), { lineWrapping: true });
    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
        richTextShortcuts: true,
        richTextToolbar: true,
        defaultText: 'Hello, World!'
    });

    var chatRef = firebaseData.database().ref('/chat/' + $scope.groupId + '/');

 
/*
    chatRef.push({
        name: "Test name",
        text: $scope.messageText
    })*/

    firebaseData.provider().onAuthStateChanged(function(user) {
        chatRef.off();
        var setMessage = function(data){
            $scope.messages.push(data.val());
            //Apply causing issues. Commented out for now and everything seems to be working okay.
            // $scope.$apply();
        }

        chatRef.limitToLast(12).on('child_added', setMessage);
        chatRef.limitToLast(12).on('child_changed', setMessage);
    });

    $scope.saveMessage = function() {
        if(!$scope.messageText) {
            return;
        }

        chatRef.push({
            name: "Test name",
            text: $scope.messageText
        }).then(function() {
            $scope.messageText = "";
            //This apply seems to be okay. Comment out if we're still getting errors.
            $scope.$apply();
        });
    }

    $scope.location = $location;
    // Gets groupId from the url
    $scope.$watch('location.search()', function() {
        $scope.groupId = ($location.search()).groupId; 
        // Get group data from groupId
        
    }, true);
    // Changes groupId in the url
    $scope.changeTarget = function(name) {
        $location.search('groupId', name);
    }
    $scope.groupInfo = {};

    $scope.getGroupData = function()
    {
      $http.get('https://groupgenius-5953b.firebaseio.com/groups.json').success(function (response) 
      {
        var key;
        for (key in response)
        {
            if (response[key].groupId == $scope.groupId)
            {
                $scope.groupInfo = response[key];
                return;
            }
        }
    });
  };
});


function getUniqname(email){
    console.log(email);
    return email.substring(0,email.indexOf('@'));
}