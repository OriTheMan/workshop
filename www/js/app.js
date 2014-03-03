// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
    var adapter = new MemoryAdapter();
    adapter.initialize().done(function () {
        console.log("Data adapter initialized");
    });

    /* --------------------------------- Event Registration -------------------------------- */
    $('.search-key').on('keyup', findByName);
    $('.help-btn').on('click', function() {
        alert("Some help here...")
    });
	
	document.addEventListener('deviceready', function () {
		if (navigator.notification) { // Override default HTML alert with native dialog
			window.alert = function (message) {
				navigator.notification.alert(
					message,    // message
					null,       // callback
					"Workshop", // title
					'OK'        // buttonName
				);
			};
		}
	}, false);
	
	$(".add-location-btn").click(function(e) {
		addLocation(e);
	});
	
	$(".change-pic-btn").click(function(e) {
		changePicture(e);
	});


    /* ---------------------------------- Local Functions ---------------------------------- */
    function findByName() {
        adapter.findByName($('.search-key').val()).done(function (employees) {
            var l = employees.length;
            var e;
            $('.employee-list').empty();
            for (var i = 0; i < l; i++) {
                e = employees[i];
                $('.employee-list').append('<li><a href="#employees/' + e.id + '">' + e.firstName + ' ' + e.lastName + '</a></li>');
            }
        });
    }

}());

	function addLocation(event) {
		event.preventDefault();
		navigator.geolocation.getCurrentPosition(
			function(position) {
				alert(position.coords.latitude + ',' + position.coords.longitude);
			},
			function() {
				alert('Error getting location');
			});
		return false;
	}

	function changePicture(event) {
		event.preventDefault();
		if (!navigator.camera) {
			alert("Camera API not supported", "Error");
			return;
		}
		var options =   {   quality: 50,
							destinationType: Camera.DestinationType.DATA_URL,
							sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Album
							encodingType: 0     // 0=JPG 1=PNG
						};
	 
		navigator.camera.getPicture(
			function(imageData) {
				$('.employee-image', this.el).attr('src', "data:image/jpeg;base64," + imageData);
			},
			function() {
				alert('Error taking picture', 'Error');
			},
			options);
	 
		return false;
	}
	
	
	 var pictureSource;   // picture source
    var destinationType; // sets the format of returned value 

    // Wait for PhoneGap to connect with the device
    //
    document.addEventListener("deviceready",onDeviceReady,false);

    // PhoneGap is ready to be used!
    //
    function onDeviceReady() {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
      // Uncomment to view the base64 encoded image data
      // console.log(imageData);

      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');

      // Unhide image elements
      //
      smallImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI 
      // console.log(imageURI);

      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');

      // Unhide image elements
      //
      largeImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    }

    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50 });
    }

    // A button will call this function
    //
    function capturePhotoEdit() {
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true }); 
    }

    // A button will call this function
    //
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }

    // Called if something bad happens.
    // 
    function onFail(message) {
      alert('Failed because: ' + message);
    }
