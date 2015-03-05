var myApp = angular.module('myApp', ['ngRoute', 'firebase', 'timer', 'ui.bootstrap'])
.constant('FIREBASE_URL', 'https://crowdtale.firebaseio.com/');

//var appControllers = angular.module('appControllers');

myApp.config(['$routeProvider', function($routeProvider) {

	$routeProvider.
		when('/home', {
			templateUrl: 'views/home.html',
			controller: 'HomeController'
		}).
		when('/write-tale', {
			templateUrl: 'views/write-tale.html',
			controller: 'TalesController'
		}).
		when('/write-tale/:key', {
			templateUrl: 'views/write-tale.html',
			controller: 'TalesController'
		}).
		when('/tales', {
			templateUrl: 'views/tales.html',
			controller: 'TalesController'
		}).
		when('/login', {
			templateUrl: 'views/login.html',
			controller: 'RegistrationController'
		}).
		when('/register', {
			templateUrl: 'views/register.html',
			controller: 'RegistrationController'
		}).
		when('/read-tales', {
			templateUrl: 'views/readtales.html',
			controller: 'ReadTalesController'
		}).
		when('/read-tales/:key', {
			templateUrl: 'views/read-tale.html',
			controller: 'ReadTalesController'
		}).
		otherwise({
			redirectTo: '/home'
		});
}]);

myApp.filter('filterTales', function () {
    return function (tales, user, myfilter) {
        var items = {
            tales: tales,
            out: []
        };

        //console.log(tales);

       // console.log(myfilter);

        var date = new Date(Date.now()).getTime();

        angular.forEach(tales, function (value, key) {
        	//console.log(this.tales[key]);


            if ((this.tales[key].createdby == user) || (this.tales[key].assigned_to == user) ){
            	if (myfilter == "All")
            	{
	            	this.out.push(value);
            	}
            	else if (myfilter == "Created By Me")
            	{
            		if (this.tales[key].createdby == user) {
            			this.out.push(value);
            		}
            	}
            	else {
            		if (this.tales[key].futureDate >= date)
	                	this.out.push(value);
            	}
            }
        }, items);
        return items.out;
    };
});

myApp.filter('filterGenre', function () {
    return function (tales, myfilter) {
        var items = {
            tales: tales,
            out: []
        };

        console.log(tales);

       console.log(myfilter);

        var date = new Date(Date.now()).getTime();


        angular.forEach(tales, function (value, key) {

        	if (myfilter) {
            if (this.tales[key].genre == myfilter) {
            	this.out.push(value);
   
            }
            else if (myfilter == "All")
            	this.out.push(value);
        }
        else {
        	this.out.push(value);
        }
        }, items);
        return items.out;
   	 
    };
});