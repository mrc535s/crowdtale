myApp.factory('Authentication', function($rootScope, $firebase, $location, $firebaseAuth, FIREBASE_URL)
{
	var ref = new Firebase(FIREBASE_URL);
	var simpleLogin = $firebaseAuth(ref);



	var myObject = {
		login : function (user, regOpt) {
			return simpleLogin.$authWithPassword({
				email: user.email,
				password: user.password

			}).then(function(authData){

			if (regOpt) {

				var user_ref = new Firebase (FIREBASE_URL + 'users');
				var firebaseUsers = $firebase(user_ref);
	  			var userInfo = {
	  				date: Firebase.ServerValue.TIMESTAMP,
	  				regUser: authData.uid,
	  				firstname: user.firstname,
	  				lastname: user.lastname,
	  				email: user.email
	  			}
	  			firebaseUsers.$set(authData.uid, userInfo);
	  			console.log("Logged in as:", authData.uid);
  			
  				
			} else {
  				console.log("No Reg");
			}
			var userRef = new Firebase (FIREBASE_URL + 'users/' + authData.uid);
			var userObj = $firebase(userRef).$asObject();

			console.log(userObj);

			userObj.$loaded().then(function() {
				$rootScope.currentUser = user;
				$rootScope.$broadcast('$firebaseAuth:authWithPassword',authData);
             	return authData;

			});

          });
		},//logout

		logout : function (){
			$rootScope.$broadcast('$firebaseAuth:unauth');
			return simpleLogin.$unauth();
		},
		register : function (user) {
			return simpleLogin.$createUser(user.email, user.password)

		},//register

		signedIn : function () {
			return $rootScope.currentUser;
		}

	} //myObject

	$rootScope.signedIn = function() {
		return myObject.signedIn();
	}

	return myObject;
});