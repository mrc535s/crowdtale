myApp.controller('ReadTalesController', function($scope, $location, $routeParams, $rootScope, $firebase, $firebaseAuth, FIREBASE_URL) {

	
	var ref = new Firebase(FIREBASE_URL);
	$scope.tales = [];

	var key = $routeParams.key;
	var username = $routeParams.user;

	var talesURL =  "/tales";

	var ref = new Firebase (FIREBASE_URL + talesURL);

	var talesInfo = $firebase(ref);
	
	//$scope.talesInfo = talesInfo.$asObject();
	var tales = $firebase(ref).$asObject();
	var talesArray = $firebase(ref).$asArray();

	tales.$loaded().then(function(data){
		$scope.tales = tales;
	});

	 $scope.setPage = function (pageNo) {
		$scope.currentPage = pageNo;
	 };

	talesArray.$loaded().then(function(data){
		$scope.talesArray = talesArray;

	});

  if (tales)
  {
    if (key) {

  	var taleref = new Firebase (FIREBASE_URL + talesURL + "/" + key + "/" );
  	var taleChapterRef = new Firebase (FIREBASE_URL + "/taleChapters/" + key + "/");
  	$scope.chapters = $firebase(taleChapterRef).$asArray();
  	$scope.currentPage = 1;
  	$scope.chapters.$loaded().then(function(data){
  	$scope.chaptersCount = $scope.chapters.length;

	if ($scope.chaptersCount > 0)
		$scope.chapterChk = true;
  	$scope.$watch('currentPage', function() {
		  var begin = ($scope.currentPage - 1) * 1;
		  var end = begin + 1;
		  $scope.paged = {
		    chapters: $scope.chapters.slice(begin, end)
		  }

		 // console.log($scope.paged.chapters);
	});


	});

	var thistale = $firebase(taleref).$asObject();
	$scope.thistale = thistale;

	$scope.loadCanvasRead = function(author, this_key) {
	    //Set up some globals
		var pixSize = 8, lastPoint = null, currentColor = "000", mouseDown = 0;
		//Create a reference to the pixel data for our drawing.
		var pixelDataRef = new Firebase(FIREBASE_URL + "/taleChapters/" + key + "/" + author + "/image");

		var newAuthor = $firebase(pixelDataRef).$asObject();

		newAuthor.$loaded().then(function(data){

		$scope.author = author;

		if (username != author) {
		    if (!newAuthor.author) {
		    	newAuthor.author = username;
		    	newAuthor.$save(); 
		    }

		    if (!newAuthor.published) {
		    	newAuthor.published = false;
		    	newAuthor.$save();
		    }
		}
		if ((username == newAuthor.author) && (newAuthor.published == false))
	    	$scope.imageAuthor = true

	    else
	    	$scope.imageAuthor = false;

		var myCanvas = document.getElementById('drawing-canvas-' + this_key);
		var myContext = myCanvas.getContext ? myCanvas.getContext('2d') : null;
		if (myContext == null) {
		  alert("You must use a browser that supports HTML5 Canvas to run this demo.");
		  return;
		}

		//Keep track of if the mouse is up or down
		myCanvas.onmousedown = function () {mouseDown = 1;};
		myCanvas.onmouseout = myCanvas.onmouseup = function () {
		  mouseDown = 0; lastPoint = null;
		};

		//Draw a line from the mouse's last position to its current position
		var drawLineOnMouseMove = function(e) {
		  if (!mouseDown) return;

		  e.preventDefault();

		  // Bresenham's line algorithm. We use this to ensure smooth lines are drawn
		  var offset = $('canvas').offset();
		  var x1 = Math.floor((e.pageX - offset.left) / pixSize - 1),
		    y1 = Math.floor((e.pageY - offset.top) / pixSize - 1);
		  var x0 = (lastPoint == null) ? x1 : lastPoint[0];
		  var y0 = (lastPoint == null) ? y1 : lastPoint[1];
		  var dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
		  var sx = (x0 < x1) ? 1 : -1, sy = (y0 < y1) ? 1 : -1, err = dx - dy;
		  while (true) {
		    //write the pixel into Firebase, or if we are drawing white, remove the pixel
		   
		    	//pixelDataRef.child(x0 + ":" + y0).set(currentColor === "fff" ? null : currentColor);

		    if (x0 == x1 && y0 == y1) break;
		    var e2 = 2 * err;
		    if (e2 > -dy) {
		      err = err - dy;
		      x0 = x0 + sx;
		    }
		    if (e2 < dx) {
		      err = err + dx;
		      y0 = y0 + sy;
		    }
		  }
		  lastPoint = [x1, y1];
		};

		    $(myCanvas).mousemove(drawLineOnMouseMove);
		    $(myCanvas).mousedown(drawLineOnMouseMove);


		// Add callbacks that are fired any time the pixel data changes and adjusts the canvas appropriately.
		// Note that child_added events will be fired for initial pixel data as well.
		    var drawPixel = function(snapshot) {
		      var coords = snapshot.key().split(":");
		      myContext.fillStyle = "#" + snapshot.val();
		      myContext.fillRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
		    };
		    var clearPixel = function(snapshot) {
		      var coords = snapshot.key().split(":");
		      myContext.clearRect(parseInt(coords[0]) * pixSize, parseInt(coords[1]) * pixSize, pixSize, pixSize);
		    };
		    pixelDataRef.on('child_added', drawPixel);
		    pixelDataRef.on('child_changed', drawPixel);
		    pixelDataRef.on('child_removed', clearPixel);


		});

		};


}


}

}); // Read Tales Controller