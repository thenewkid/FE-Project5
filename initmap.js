function initializeMap() {

	initializeKnockout();

	var infoWindow = createInfoWindow();
	/* 
		call the create map method in my map_utils.js file
		this method takes an id of our html element to hold the map
		returns the map object and sets the html element to hold the map
	*/
	var map = createMap("map-canvas");

	/* 
		create and retrieve the google.maps.places.PlacesService object by passing in our map object
		the PlacesService object is very important because it has methods like getDetails and nearbySearch
		these methods return additional info about a certain place and retrieve places within a certain radius
	*/
	var service = createPlacesService(map);

	/* 
		initialize our bounds object to be chicago, Il
	*/
	var bounds = createBounds(41.881832,-87.623177);

	/* 
		googleMapSearch is an object that holds the input box where users where type in their map queries
		createGoogleSearch takes in an id of an input element and the map object and returns a google.maps.places.SearchBox
		element. This object has method called getPlaces that returns a list of place objects returned by a search
	*/
	var googleMapSearch = createGoogleSearch("google-search", map);


	/* 
		If we had everything in this file except for this function call fitBounds(), the map would not load because the map
		must be fit around a bounds object. Even if the bounds object is empty, the map will load just fine. 
	*/
	fitBounds(map, bounds);


	/* 
		the input element for our google map search is initialized to display : none in style.css. That way when the tiles have loaded
		for the map we can show the search box, If I didn't have this then the box would show up before the map
		has loaded and then reposition which doesnt look as nice
	*/
	addMapListener(map, 'tilesloaded', tilesLoadedCallBack);

	/* 
		Add a listener to the google Search Box object to call searchFunction when someone types in a query

	*/
	addMapListener(googleMapSearch, 'places_changed', placesChangedCallBack);

	/* 
		Udacity wants me to hardcode 5 places so this function is the function that does it
	*/
	initializePlaces(bounds, infoWindow, map);


	/* 
	This function gets run every time the user types in a query and hits enter
	*/
	function placesChangedCallBack() {
		var places = this.getPlaces();
		if (places.length == 0)
			return

		places.forEach(function(place) {
			var marker = createMarker(place,map);

			addMarker(marker);
			extendBounds(bounds,place.geometry.location);
			fitBounds(map,bounds);

			addMapListener(marker, 'click', function() {
				infoWindow.setContent(place.name);
				infoWindow.open(map, this);
				this.setAnimation(google.maps.Animation.BOUNCE);

				setTimeout(function() {
					marker.setAnimation(null);
				}, 3000);
			});

			if (!mapViewModel.contains(place.place_id))
				addPlace(place);

		})
	}
	
}

/*
	add the map listener to call our intializeMap function when the window loads
	when the window loads, we also want to initialize our knockout view model
*/
addDomListener(window, 'load', initializeMap);

/*
	Specific functions for my application
*/

/* 
	Throughout use of the application, the tilesloaded event will fire multiple times
	We have to check that our searchbox is actually hidden and has not been initialized 
	before we make it visible on the screen. Because its initialized to display none. When we check the 
	display using javscript the display comes up as empty quote "".

	If I set it to display: none using js instead of in the css, checking the style.display will come up "none". weird...

*/
function tilesLoadedCallBack() {
	if (displayEqualsEmptyQuote("google-search"))
		show("google-search");
}

/*
	init list of cities
	for each city, send ajax request to google asking for the place object associated with the city
	on ajax success create a marker, add marker, extendBounds, add place
	set marker onclick to open up infoWindow
*/
function initializePlaces(bounds, infoWindow, map) {
	var hardCodedCities = [
							"Chicago,IL",
							"Deerfield,IL",
							"Evanston,IL",
							"Highlandpark,IL",
							"Skokie,IL"
							];

	hardCodedCities.forEach(function(city) {
		getPlaceJson(city,map,bounds,infoWindow);
	});
}

function getPlaceJson(city,map,bounds,infoWindow) {
	var googJsonUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=city";
	var readyUrl = replace(googJsonUrl, "city", city);

	$.ajax({
		url: readyUrl,
		success: function(resultObject) {
			var place = resultObject.results[0];
			var marker = createMarker(place,map);

			addMarker(marker);
			extendBounds(bounds,place.geometry.location);
			fitBounds(map,bounds);

			addMapListener(marker, 'click', function() {
				infoWindow.setContent(place.formatted_address);
				infoWindow.open(map, this);
				this.setAnimation(google.maps.Animation.BOUNCE);

				setTimeout(function() {
					marker.setAnimation(null);
				}, 3000);
			});

			addPlace(place);
		}
	});
}

function bounceAssociatedMarker(data) {
	log(data);
}

