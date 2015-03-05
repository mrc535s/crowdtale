myApp.controller('TalesController', function($scope, $location, $routeParams, $rootScope, $firebase, $firebaseAuth, FIREBASE_URL) {

	Date.prototype.addHours= function(h){
	    this.setHours(this.getHours()+h);
	    return this;
	}
	
	var ref = new Firebase(FIREBASE_URL);
	var simpleLogin = $firebaseAuth(ref);


	function addMinutes(minutes) {
		var date = Date.now();
    	return new Date(date.getTime() + minutes*60000);
	}

	//var ref = new Firebase (FIREBASE_URL + '/users/' +  + 'meetings');

	var authData = simpleLogin.$getAuth();

	if (authData) {
		
		var key = $routeParams.key;
		var username = authData.uid;

		$scope.setPage = function (pageNo) {
   			 $scope.currentPage = pageNo;
  		};




		$scope.checkOwnership = function(creator) {

			if (creator == username)
			{
				return true;
			}

		};

		$scope.tales = [];
		$scope.count = 0;
		$scope.date = Date.now();
		$scope.username = username;
		$scope.userDraw = false;

		//Get the tales date from firebase
		var talesURL =  "/tales";

		var ref = new Firebase (FIREBASE_URL + talesURL);

		var talesInfo = $firebase(ref);
		
		//$scope.talesInfo = talesInfo.$asObject();
		var tales = $firebase(ref).$asObject();
		var talesArray = $firebase(ref).$asArray();

		tales.$loaded().then(function(data){
			$scope.tales = tales;

	
		});

		talesArray.$loaded().then(function(data){
			$scope.talesArray = talesArray;
			$rootScope.howManytales = talesArray.length;
		});

		talesArray.$watch(function(event){
			$rootScope.howManytales = talesArray.length;
		});


		$scope.deleteTale=function(key) {

			var confirm = window.confirm("Are you sure you want to delete?");
			if (confirm)
				talesInfo.$remove(key);
		}

      if (tales) //Make sure there are some tales 
      {

        if (key) { //Only do this if on an indivdual tale page
        
      	var taleref = new Firebase (FIREBASE_URL + talesURL + "/" + key + "/" );
      	var taleChapterRef = new Firebase (FIREBASE_URL + "/taleChapters/" + key + "/");

      	var talechild = $firebase(taleChapterRef.child(username));

      	$scope.chapters = $firebase(taleChapterRef).$asArray();
      	//$scope.allAuthors = array();

      	$scope.currentPage = 1;

      	var taleChapter = talechild.$asObject();

		var thistale = $firebase(taleref).$asObject();

		var thistaleArray = $firebase(taleref).$asArray();


		thistaleArray.$loaded().then(function(data)
		{
			$scope.thistaleArray = thistaleArray[4];

			console.log ($scope.thistaleArray);

		});


		taleChapter.$loaded().then(function(data)
		{
			$scope.taleChapter = taleChapter;

			if (!taleChapter.text) 
			{


				$scope.showPublishTaleButton = false;
			}
			else
				$scope.showPublishTaleButton = true;

		});

		
		

		thistale.$loaded()
		  .then(function(data) {
		  	$scope.thistale = thistale;

		  	if ($scope.thistale.status == "published")
		  		$location.path( "/read-tales/" + key );

		  	if ($scope.thistale.drawMode == true)
		  		$scope.userDraw = true;


			$scope.countOf = function(text) {
		    	var s = text ? text.split(/\s+/) : 0; 

		    	if (s.length > 50)
		    	{
		    		$scope.showMsg ("Your chapter is too long.  It must be less than 50 words");
		    		return s ? s.length : '';
		    	}
		    	else {

			    	$scope.msgshow = false;

			    	if (s) {
			    		$scope.taleChapter.words = s ? s.length : '';
			    		

			    		console.log($scope.taleChapter.words);


			    		return s ? s.length : '';
			    	}
			    	else
			    		return 0;
			    	}
			    	

			};
		    if (($scope.thistale.status == "assigned") && ($scope.thistale.assigned_to == username))
		    	if(!$scope.thistale.drawMode)
	       			$scope.showEditor = true;
	       		else
	       		{
	       			$scope.taleOpen = true;
	       		}
			else if ($scope.thistale.status == "open") {
				$scope.taleOpen = true;
				$scope.showEditor = false;

			if ($scope.thistale.createdby == username) {

				$scope.publishButton = true;
			}

			}
			else 
	       		$scope.showEditor = false;


		  })
		  .catch(function(error) {
		    console.error("Error:", error);

		  });


		   $scope.chapters.$loaded().then(function(data){

      		$scope.chaptersCount = $scope.chapters.length;
      		//$scope.chapters.reverse();
	      	$scope.$watch('currentPage', function() {
				  var begin = ($scope.currentPage - 1) * 1;
				  var end = begin + 1;

				  $scope.paged = {
				    chapters: $scope.chapters.slice(begin, end)
				  }

				  console.log($scope.paged.chapters);
			});

			 if ($scope.chaptersCount > 0)
      			$scope.chapterChk = true;

	
		});

	$scope.showMsg = function (msg) {
		$scope.msgshow = true;
		$scope.message = msg;
	};

	$scope.takeControl = function () {
		

		$scope.thistale.status = "assigned";
		$scope.thistale.assigned_to = username;

	
		thistale.$save();

		$scope.showEditor = true;
		$scope.taleOpen = false;


	};

	 $scope.drawImg = function (this_author) {
   		$scope.userDraw = true;

   		$scope.thistale.status = "assigned";
   		$scope.thistale.assigned_to = username;
   		$scope.thistale.drawMode = true;

   		var pixelDataRef = new Firebase(FIREBASE_URL + "/taleChapters/" + key + "/" + this_author + "/image");



   		var obj = $firebase(pixelDataRef);
		obj.$update({author: username}).then(function(){
			$scope.imageAuthor = true
			//$scope.imageAuthor = false;
		});



   		thistale.$save();
  	};


	$scope.publishTale = function() {

		var confirm = window.confirm("Are you sure you want to publish?  No changes can be made once the entire tale has been published");

		

		if (confirm) {

			$scope.thistale.status = "published";
		
			thistale.$save().then(function(ref) {
			  ref.key() === thistale.$id; // true

			  $location.path( "/read-tales/" + key );
			}, function(error) {
			  console.log("Error:", error);
			});

		}

	}

	$scope.publishTaleChapter = function() {

		var confirm = window.confirm("Are you sure you want to publish?  No changes can be made once the tale chapter has been published");



		if (confirm) {

			//Track the authors who have published to the tale.
			
			var totalAuthors = $scope.thistale.authors.length;

			if ($scope.thistale.authors.totalAuthors != username)

   				$scope.thistale.authors = {totalAuthors: username};

			$scope.thistale.status = "open";
		
			thistale.$save().then(function(ref) {
			  ref.key() === thistale.$id; // true
			  $location.path( "/read-tales/" + key );
			}, function(error) {
			  console.log("Error:", error);
			});
			$scope.taleChapter.published = true;
			taleChapter.$save().then(function(ref) {
			  ref.key() === taleChapter.$id; // true
			}, function(error) {
			  console.log("Error:", error);
			});


		}

	}

	$scope.closeMsg = function() { 

		$scope.msgSaved = false;
	}

		$scope.saveTale = function() {

		
		$scope.taleChapter.published = false;
		$scope.taleChapter.author = username;

		$scope.thistale.totalWords = $scope.thistale.totalWords + $scope.taleChapter.words;

		console.log($scope.thistale.totalWords);

		taleChapter = $scope.taleChapter;

		thistale = $scope.thistale;

		thistale.$save();
		taleChapter.$save();

		$scope.msgSaved = true;
		$scope.showPublishTaleButton = true;

		}

	}

	$scope.clearImage = function ()
	{
		var pixelDataRef = new Firebase(FIREBASE_URL + "/taleChapters/" + key + "/" + $scope.author + "/image");
		//pixelDataRef.remove();

		var obj = $firebase(pixelDataRef).$asObject();

		obj.$remove().then(function() {

			var newpixelDataRef = new Firebase(FIREBASE_URL + "/taleChapters/" + key + "/" + $scope.author + "/image");
    		var newAuthor = $firebase(newpixelDataRef).$asObject();

    		newAuthor.$loaded().then(function(data){
		
		    	newAuthor.author = username;
		    	newAuthor.$save(); 
    
			});
		})

	
	};

	$scope.publishImage = function (this_author)
	{
		var pixelDataRef = new Firebase(FIREBASE_URL + "/taleChapters/" + key + "/" + this_author + "/image");
		//pixelDataRef.remove();

		var obj = $firebase(pixelDataRef);
		obj.$update({published: true}).then(function(){
			$scope.imageAuthor = false;
		});

		//$scope.userDraw = false;
		var totalAuthors = $scope.thistale.authors.length;

   		$scope.thistale.status = "open";


   		//$scope.thistale.authors = {totalAuthors: username};
   		   	var taleref = new Firebase (FIREBASE_URL + talesURL + "/" + key + "/" );
      	var taleChapterRef = new Firebase (FIREBASE_URL + "/taleChapters/" + key + "/");

      	var taleAuthors = $firebase(taleref.child('authors'));


      	taleAuthors.$push(username);

   		//$scope.thistale.assigned_to = username;
   		$scope.thistale.drawMode = false;

   		thistale = $scope.thistale;

   		

   		//thistale.$push({authors:username}).then(function() {
   		thistale.$save();

	
	
	};

	$scope.loadCanvas = function(author, this_key) {
		    //Set up some globals
    var pixSize = 8, lastPoint = null, currentColor = "000", mouseDown = 0;

    //Create a reference to the pixel data for our drawing.
    var pixelDataRef = new Firebase(FIREBASE_URL + "/taleChapters/" + key + "/" + author + "/image");

    var newAuthor = $firebase(pixelDataRef).$asObject();

    newAuthor.$loaded().then(function(data){
    $scope.author = author;

  	checkParticipation();

    console.log('Key: ' + key);

    if ((newAuthor.published == true) && (newAuthor.author == username))
    {
    	$location.path('/read-tales/' + key);
    }

    
			

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

    //Setup each color palette & add it to the screen
    var colors = ["fff","000","f00","0f0","00f","88f","f8d","f88","f05","f80","0f8","cf0","08f","408","ff8","8ff"];
    for (c in colors) {
      var item = $('<div/>').css("background-color", '#' + colors[c]).addClass("colorbox");
      item.click((function () {
        var col = colors[c];
        return function () {
          currentColor = col;
        };
      })());
      item.appendTo('#colorholder');
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
         if ($scope.imageAuthor){
        	pixelDataRef.child(x0 + ":" + y0).set(currentColor === "fff" ? null : currentColor);

    	}

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
	
		function checkParticipation() {
			var chapAuthor = $scope.author;

			var pixelDataRef = new Firebase(FIREBASE_URL + "/taleChapters/" + key + "/" + chapAuthor);

		    var thisChapter = $firebase(pixelDataRef).$asObject();

		    thisChapter.$loaded().then(function(data){
		    
		    if ((thisChapter.published == true) && (thisChapter.author == username))
		    {
		    	if (thistale.createdby == username)
		    		$scope.publishOnly = true;
		    	else
		    		$location.path('/read-tales/' + key);
		    }
			});


		}

		});

	};




}

	$scope.createTale = function(isValid) {

		var date = new Date (Date.now());

		if (!isValid) {
                alert('invalid Form');
            }
        else {

			var maxWordsPerUser, minWords, maxWords, futureDate;

			switch($scope.newType) {
    		case "Micro":
        		futureDate = addMinutes(10);
        		maxWordsPerUser = 25;
        		minWords = 50;
        		maxWords = 100;
        		maxPics = 1;
        	break;
    		case "Mini":
        		futureDate = new Date(Date.now()).addHours(1);
        		maxWordsPerUser = 50;
        		minWords = 100;
        		maxWords = 250;
        		maxPics = 2;
        	break;
    		case "Kids":
        		futureDate = new Date(Date.now()).addHours(4);
        		maxWordsPerUser = 250;
        		minWords = 500;
        		maxWords =2000;
        		maxPics = 4;
        	break;
     		case "Short":
        		futureDate = new Date(Date.now()).addHours(10);
        		maxWordsPerUser = 400;
        		minWords = 3000;
        		maxWords = 6000;
        		maxPics = 0;
        	break;
        	case "Book":
        		futureDate = new Date(Date.now()).addHours(48);
        		maxWordsPerUser = 1000;
        		minWords = 10000;
        		maxWords = 20000;
        		maxPics = 0;
        	break;
        	case "Mini":
        		futureDate = new Date(Date.now()).addHours(168);
        		maxWordsPerUser = 2500;
        		minWords = 30000;
        		maxWords = 50000;
        		maxPics = 0;
        	break;
    		default:
    			$scope.newType = "Mini";
        		futureDate = new Date(Date.now()).addHours(1);
        		maxWordsPerUser = 50;
        		minWords = 100;
        		maxWords = 250;
        		maxPics = 2;
			} 

			var tale = {title: $scope.newTitle, type: $scope.newType, created_date: date.getTime(), status: "assigned", maxWords: maxWords, maxWordsPerUser: maxWordsPerUser, minWords: minWords, totalWords: 0, createdby: username, assigned_to: username, description: $scope.description, futureDate: futureDate.getTime(), genre: $scope.genre, maxPics: maxPics, authors: {0: username}};

			 var newTale =  talesInfo.$push(tale).then(function(data){
				//$scope.meetingname = '';
				     $scope.newTitle = "";
	        		$scope.newType = "";
	        		$scope.description = "";
	        		var taleKey = data.key();
	        		var newTaleChapterRef = new Firebase (FIREBASE_URL + "/taleChapters/" + taleKey+ "/");

			var newTaleChild= $firebase(newTaleChapterRef.child(username));

      		var newTaleChapter = newTaleChild.$asObject();

      		newTaleChapter.words = 0;
      		newTaleChapter.text = "";
      		newTaleChapter.author = username;
      		newTaleChapter.published = false;

      		newTaleChapter.$save();


			})

			//var taleKey = newTale.key();

			



    	}

      }

  }

  else 
  {
  	$location.path('/login');
  }

	


}); //Tales Controller