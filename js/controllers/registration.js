myApp.controller('RegistrationController', function($scope, $rootScope, $location, $firebaseAuth, Authentication,
	FIREBASE_URL) {

	var ref = new Firebase(FIREBASE_URL);
	var usersRef = new Firebase(FIREBASE_URL + 'users')
	$scope.firebaseUsers = $firebaseAuth(usersRef);
	var userInfo;

	$scope.authObj = $firebaseAuth(ref);

	$scope.login = function() {
		Authentication.login($scope.user, false)
		.then(function(authData) {
 			 //console.log("Logged in as:", authData.uid);
 			 $location.path('/tales');
		}).catch(function(error) {
  			console.error("Authentication failed:", error);
  			$scope.message = error.toString();
		});	
	}

	$scope.register = function() {
		Authentication.register($scope.user)
		.then(function() {

 			Authentication.login($scope.user, true).then(function()
 			{
 				$location.path('/tales');
	 		});

		}).catch(function(error) {
  			console.error("Authentication failed:", error);
  			$scope.message = error.toString();
		});	
	}

		/*$scope.login = function() {
		ref.authWithPassword({
			email : $scope.user.email,
			password : $scope.user.password
		}, function(error, authData) {
			if (error) {
			console.log("Login Failed!", error);
				} else {
			//console.log("Authenticated successfully with payload:", authData);
			$location.path('/meetings');

			}
		});	
	}*/

});