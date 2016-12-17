'use strict';

angular.module('myApp.controllers.signup', [])

// Homepage controller
.controller('SignUpCtrl', function($scope, $location, $rootScope, firebaseData) {
	$scope.emailSignUp = "";
	$scope.passwordSignUp = "";
	$scope.emailSignIn = "";
	$scope.passwordSignIn = "";
	$scope.signUpErrorMessage = "";
	$scope.loginErrorMessage = "";
	$scope.showSignUp = true;
	$scope.firstName = "";
	$scope.user = {
		firstName: "",
		lastName: "",
		email: "",
		password: ""
	};

	$scope.signUp = function() {
		//$scope.addUserToFirebase(this.firstName, this.last);
		firebaseData.provider()
			.createUserWithEmailAndPassword($scope.user.email, $scope.user.password)
			.then(function() {
				console.log("user signed up.");
				$scope.addUserToFirebase($scope.user);

				$scope.$apply(function() {
					redirect('/user');	
				});
			})
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
			.signInWithEmailAndPassword(this.emailSignIn, this.passwordSignIn)
			.then(function() {
				console.log('User signed in.');
				$scope.$apply(function() {
					redirect('/user');	
				});
			})
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

	var redirect = function(path) {
		$location.path(path);
	}
	$scope.addUserToFirebase = function(user) {
	  // A post entry.
	  var newUser = {
	    firstName: user.firstName, 
	    lastName: user.lastName,
	    uid: firebase.auth().currentUser.uid,
	    email: user.email
								  
	  };

	  // Get a key for a new Post.
	  var newPostKey = firebase.database().ref().child('users').push().key;

	  var updates = {};
	  //write the user to the user list
	  updates['/users/' + newPostKey] = newUser;
	 
	  return firebase.database().ref().update(updates);
	}
});