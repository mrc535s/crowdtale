myApp.directive("timeLeft", ['$timeout', function(timer) {
  var linkFunction = function(scope, element, attributes) {

               
     var timerTime = function () {

    	var date = new Date(Date.now()); 
     var deadline = attributes["timeLeft"];
     var diff = deadline / 1000 - date.getTime() / 1000;

      scope.count++;


      var clockTxt = ".clock-" + scope.count;
     	clock = $(clockTxt).FlipClock(diff, {
					clockFace: 'MinuteCounter',
					countdown: true
				});
     	}
     

      timer(timerTime, 0);
    
  };
 

  return {
  	  restrict: "A",
  	  transclude: true,
      compile: function compile(tElement, tAttrs, transclude) {
         return {
           post: linkFunction
         }
      }
   };
}]);