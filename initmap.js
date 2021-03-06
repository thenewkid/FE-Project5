function initializeMap() {

	//var yelp = initYelp();
	/* 
		Get our infowindow
	*/

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

	initializeKnockout(service, bounds, infoWindow, map);
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
	initializePlaces(bounds, infoWindow, map,service);


	/* 
		This function gets run every time the user types in a query and hits enter
		I am setting the markers title to be the formatted_address of the place object its associated with
		Before I add a marker I have to make sure that a marker with the same title -> place.formatted_adddress
		is not already in my mapviewModel.markers
	*/
	function placesChangedCallBack() {
		var places = this.getPlaces();
		if (places.length === 0)
			return;

		places.forEach(function(place) {

			if (!mapViewModel.containsMarker(place.formatted_address)) {
				log("viewmodel does not contain marker with title " + place.formatted_address);
				addMarkerFitMap(place, map, bounds, infoWindow, mapViewModel);
				mapViewModel.addPlace(place);
			}

		});
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
function initializePlaces(bounds, infoWindow, map, service) {
	var hardCodedCities = [ 
							"Chicago,IL",
							"Deerfield,IL",
							"Evanston,IL",
							"Highlandpark,IL",
							"Skokie,IL"
						];

	hardCodedCities.forEach(function(city) {
		getPlaceJson(city,map,bounds,infoWindow,service);
	});
}

function getPlaceJson(city,map,bounds,infoWindow,service) {
	var googJsonUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=city";
	var readyUrl = replace(googJsonUrl, "city", city);

	$.ajax({
		url: readyUrl,
		success: function(resultObject) {
			var place = resultObject.results[0];
			service.getDetails({placeId:place.place_id}, function(p, s) {
				if (s == google.maps.places.PlacesServiceStatus.OK) {
					addMarkerFitMap(p,map,bounds,infoWindow,mapViewModel);
					mapViewModel.addPlace(p);
				}
			});
		},
		error: function(e) {
			log(e);
		},
		fail: function(f) {
			log(f);
		}
	});
}


function requestPlaceDetails(place, service) {
	var request = {
		placeId : place.place_id
	};
	service.getDetails(request, function(p, status) {

		var noDataObject = {error : true};
		log(p);
		if (displayEqualsEmptyQuote("details") || displayNone("details")) {
			show("details");
		}
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			mapViewModel.addDetailsPlace(p);
		}

		else {
			if (mapViewModel.containsPlaceDetailsByName(place.name)) {}
			else {
				noDataObject.name = place.name;
				mapViewModel.addDetailsPlace(detailsObject);
			}
		}

		
	});
}

function foursquare(latlng, query, marker, infoWindow, map) {
	var u = "https://api.foursquare.com/v2/venues/search?client_id=IPSOH0LAWD51GZKGKSF25UGYZZ15ZC4CBDROUO4UWA4OSZLZ&client_secret=3S23FBLSWIVJHRQK0GRJBFQCJOLT1DLI32PJOP4RYXWVVUUT&v=20130815&ll=latlng&query=searchq";
	var replacementStrings = ["latlng", "searchq"];
	var userDefinedSearch = replaceAll(u, replacementStrings, [latlng, query]);

  	$.ajax({
  		url: userDefinedSearch, 
  		success:function(e) {
  			infowindowHtmlData = "";
  			foursquareData = e.response;
  			venues = foursquareData.venues;
  			venues.forEach(function(e) {
  				log(e);
  				infowindowHtmlData += "Name: " + e.name + "<br>" + "Address: " + e.location.address + "<br>";
  			});

  			infoWindow.setContent(infowindowHtmlData);
  			infoWindow.open(map, marker);

  		},
  		fail: function(e) {
  			log(e);
  		},
  		error: function(e) {
  			log(e);
  		}
  	});
}
/* 
Client id
IPSOH0LAWD51GZKGKSF25UGYZZ15ZC4CBDROUO4UWA4OSZLZ
Client secret
3S23FBLSWIVJHRQK0GRJBFQCJOLT1DLI32PJOP4RYXWVVUUT
*/
