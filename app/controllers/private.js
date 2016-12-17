'use strict';

angular.module('myApp.controllers.private', [])

// Homepage controller
.controller('PrivateCtrl', function($scope, $rootScope, firebaseData) {
    $scope.isCollapsed = true;
    $scope.messages = [];
    $scope.messageText = "";

    var firepadRef = firebaseData.database().ref();
    var codeMirror = CodeMirror(document.getElementById('wrapper-document'), { lineWrapping: true });
    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
        richTextShortcuts: true,
        richTextToolbar: true,
        defaultText: 'Hello, World!'
    });

    var chatRef = firebaseData.database().ref('/chat/');

    firebaseData.provider().onAuthStateChanged(function(user) {
        chatRef.off();
        var setMessage = function(data){
            $scope.messages.push(data.val());
            $scope.$apply();
        }

        chatRef.limitToLast(12).on('child_added', setMessage);
        chatRef.limitToLast(12).on('child_changed', setMessage);
    });

    $scope.saveMessage = function() {
        chatRef.push({
            name: "Test name",
            text: $scope.messageText
        }).then(function() {
            $scope.messageText = "";
        });
    }
});


function getUniqname(email){
    console.log(email);
    return email.substring(0,email.indexOf('@'));
}