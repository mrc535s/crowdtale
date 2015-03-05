var myApp = angular.module('myApp', ['ngRoute', 'firebase', 'appControllers'])
.constant('FIREBASE_URL', 'https://lynda-tut.firebaseio.com/');

var appControllers = angular.module('appControllers', ['firebase']);

myApp.config(['$routeProvider', function($routeProvider) {

	$routeProvider.
		when('/login', {
			templateUrl: 'views/login.html',
			controller: 'RegistrationController'
		}).
		when('/register', {
			templateUrl: 'views/register.html',
			controller: 'RegistrationController'
		}).
		when('/write-tale', {
			templateUrl: 'views/write-tale.html',
			controller: 'TalesController'
		}).
		when('/checkins/:uId/:mId', {
			templateUrl: 'views/checkins.html',
			controller: 'CheckInsController'
		}).
		when('/checkins/:uId/:mId/checkinsList', {
			templateUrl: 'views/checkinslist.html',
			controller: 'CheckInsController'
		}).
		otherwise({
			redirectTo: '/meetings'
		});
}]);