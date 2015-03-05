myApp.controller('StatusController', function($scope, $rootScope, $firebase, $firebaseAuth, 
	Authentication, $location, FIREBASE_URL) {

	//console.log($rootScope);

	$scope.logout = function () {

		Authentication.logout();
		//$scope.auth = Authentication;
		//$scope.userEmail = null;
		$location.path('/login');
	}

	var ref = new Firebase(FIREBASE_URL);
	var simpleLogin = $firebaseAuth(ref);
	//var ref = new Firebase (FIREBASE_URL + '/users/' +  + 'meetings');

	var authData = simpleLogin.$getAuth();

	if (authData)
	{
	var user_ref = new Firebase (FIREBASE_URL + 'users/' + authData.uid);
	var user = $firebase(user_ref).$asObject();

		user.$loaded().then(function() {
			$rootScope.currentUser = user;
		});
	}

	//$scope.userEmail = "email";
	$rootScope.$on('$firebaseAuth:authWithPassword', function(e, authUser){
		//console.log(authUser);
		//$scope.userEmail = authUser.password.email;

		var user_ref = new Firebase (FIREBASE_URL + 'users/' + authUser.uid);
		var user = $firebase(user_ref).$asObject();

		user.$loaded().then(function() {
			$rootScope.currentUser = user;
		});

	}); //$firebaseAuth 

	$rootScope.$on('$firebaseAuth:unauth', function(e, authUser){
		//console.log(authUser);
		$rootScope.currentUser = null;

	}); //$firebaseAuth


});