'use strict';

angular.module('myApp.controllers.private', [])

// Homepage controller
.controller('PrivateCtrl', function($scope, $rootScope, firebaseData) {
    $scope.isCollapsed = true;
    var firepadRef = firebaseData.database().ref();
    var codeMirror = CodeMirror(document.getElementById('document-wrapper'), { lineWrapping: true });
    var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror, {
        richTextShortcuts: true,
        richTextToolbar: true,
        defaultText: 'Hello, World!'
    });


});