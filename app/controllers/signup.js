'use strict';

angular.module('myApp.controllers.signup', [])

// Homepage controller
.controller('SignUpCtrl', function($scope, $rootScope, firebaseData) {
	$scope.emailSignUp = "";
	$scope.passwordSignUp = "";
	$scope.emailSignIn = "";
	$scope.passwordSignIn = "";

	$scope.showSignUp = true;

	$scope.signUp = function() {
		firebaseData.provider()
			.createUserWithEmailAndPassword($scope.emailSignUp, $scope.passwordSignUp)
			.catch(function(error) {
			  // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  console.log(errorMessage);
			});
	}

	$scope.signIn = function() {
		firebaseData.provider()
			.signInWithEmailAndPassword($scope.emailSignIn, $scope.passwordSignIn)
		    .catch(function(error) {
			  // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  if (errorCode === 'auth/wrong-password') {
			    alert('Wrong password.');
			  } else {
			    alert(errorMessage);
			  }
			  console.log(error);
			});
	}

	$scope.toggleSignUp = function() {
		$scope.showSignUp = !$scope.showSignUp;
	}
});