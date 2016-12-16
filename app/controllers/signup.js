'use strict';

angular.module('myApp.controllers.signup', [])

// Homepage controller
.controller('SignUpCtrl', function($scope, $rootScope, firebaseData) {
	$scope.emailSignUp = "";
	$scope.passwordSignUp = "";
	$scope.emailSignIn = "";
	$scope.passwordSignIn = "";
	$scope.signUpErrorMessage = "";
	$scope.loginErrorMessage = "";
	$scope.showSignUp = true;

	$scope.signUp = function() {
		firebaseData.provider()
			.createUserWithEmailAndPassword($scope.emailSignUp, $scope.passwordSignUp)
			.catch(function(error) {
			  // Handle Errors here.
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  // Need to force apply for some reason
			  // TODO: Figure out why apply is neccesary
			  // to update angular binding
			  $scope.$apply(function() {
			  	$scope.signUpErrorMessage = errorMessage;
			  });
			  console.log("Error message is: " + errorMessage);
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
			  	$scope.loginErrorMessage = "Incorrect Password.";
			  } else {
			  	$scope.loginErrorMessage = errorMessage;
			  }
			  $scope.$apply();
			  
			  console.log(error);
			});
	}

	$scope.toggleSignUp = function() {
		$scope.showSignUp = !$scope.showSignUp;
	}
});