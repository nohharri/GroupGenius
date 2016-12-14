'use strict';

angular.module('myApp.lib.services', [])

.factory('firebaseData', function($q) {
    // var FB_NAME = "https://YOUR-FIREBASE-REF.firebaseio.com/";
    var config = {
        apiKey: "AIzaSyDZJjvkGq7oy1gP753Rgi84PL5GoAF2egg",
        authDomain: "groupgenius-5953b.firebaseapp.com",
        databaseURL: "https://groupgenius-5953b.firebaseio.com",
        storageBucket: "groupgenius-5953b.appspot.com",
        messagingSenderId: "849759934347"
    };

    firebase.initializeApp(config);

    return {
        database: function() {
            return firebase.database();
        },
        storage: function () {
            return firebase.storage();
        },

    }
})

// Handles the shared header service between
// separate url routes
.factory('headerService', function($q) {
    var isAuthenticated = false;

    return {
        setAuthenticated: function(_isAuthenticated) {
            isAuthenticated = _isAuthenticated;
        },
        getAuthenticated: function() {
            return isAuthenticated;
        }
    }
})