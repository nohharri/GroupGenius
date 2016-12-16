'use strict';

angular.module('myApp.controllers.private', [])

// Homepage controller
.controller('PrivateCtrl', function($scope, $rootScope, firebaseData) {
    $scope.isCollapsed = true;
    $scope.messages = [];

    var firepadRef = firebaseData.database().ref();
    var codeMirror = CodeMirror(document.getElementById('wrapper-document'), { lineWrapping: true });
    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
        richTextShortcuts: true,
        richTextToolbar: true,
        defaultText: 'Hello, World!'
    });


    // firebaseData.provider().onAuthStateChanged(function(user) {

        var chatRef = firebaseData.database().ref('chat');
        chatRef.off();
        var setMessage = function(data){
            console.log("set message called");
            console.log(data.val());
            
            console.log($scope.messages);
            $scope.$apply(function() {
                $scope.messages.push(data.val());
            });
        }

        chatRef.limitToLast(12).on('child_added', setMessage);
        chatRef.limitToLast(12).on('child_changed', setMessage);


        // var chatRef = firebaseData.database().ref("chat");
        // // Create a Firechat instance
        // var chat = new FirechatUI(chatRef, document.getElementById("wrapper-chat"));
        // chat.setUser(user.uid, getUniqname(user.email));
    // });



});


function getUniqname(email){
    console.log(email);
    return email.substring(0,email.indexOf('@'));
}