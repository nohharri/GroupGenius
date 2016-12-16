'use strict';

angular.module('myApp.controllers.private', [])

// Homepage controller
.controller('PrivateCtrl', function($scope, $rootScope, firebaseData) {
    $scope.isCollapsed = true;
    var firepadRef = firebaseData.database().ref();
    var codeMirror = CodeMirror(document.getElementById('wrapper-document'), { lineWrapping: true });
    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
        richTextShortcuts: true,
        richTextToolbar: true,
        defaultText: 'Hello, World!'
    });


    firebaseData.provider().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        var chatRef = firebaseData.database().ref("chat");
        // Create a Firechat instance
        var chat = new FirechatUI(chatRef, document.getElementById("wrapper-chat"));
        chat.setUser(user.uid, getUniqname(user.email));

    } else {
        // No user is signed in.
        console.log("need auth");
        console.log(user);
    }
});



});


function getUniqname(email){
    console.log(email);
    return email.substring(0,email.indexOf('@'));
}