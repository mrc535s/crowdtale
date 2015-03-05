myApp.controller('HomeController', function($scope, $location, $routeParams, $rootScope, $firebase,  FIREBASE_URL) {

	
	var ref = new Firebase(FIREBASE_URL);
	
		var talesURL =  "/tales";

		var ref = new Firebase (FIREBASE_URL + talesURL);
		var newTales = ref.limitToLast(3);


		var tales = $firebase(newTales).$asObject();

		tales.$bindTo($scope, "tales");



}); //Tales Controller