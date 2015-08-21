/* 
	This is a basic framework for using google maps
*/

/* 
	Initialize our array for holding markers and places
*/

var markers = [];
var places = [];

/*
	Helper function that takes in a google.maps.Marker object and adds it to markers
*/
function addMarker(marker) {
	markers.push(marker);
}

/* 
	AddPlace object to places
*/

function addPlace(ImHavingTooMuchFun) {
	places.push(ImHavingTooMuchFun);
}
/*
	Helper function for resetting markers
*/
function resetMarkers() {
	if (markers.length > 0) {
		markers.forEach(function(marker) {
			marker.setMap(null);
		});
		markers = [];
	}
}

function createInfoWindow() {
	return new google.maps.InfoWindow();
}
/* 
	Function for creating a marker, takes in place object and map and a boolean, 
	When I get place objects from google manually, the place.geometry.location is not a google.maps.LatLng object
	this throws an error if you try to create a marker setting its position just to an object with lat lng properties.
	When I create a marker setting its position to place.geometry.location and the place is returned from googleSearch.getPlaces()
	the method that gets called when someone enters a query and hits enter, it works just fine. #garbage

	the boolean tells it whether or not to create a google.maps.latlng object for the position property of the marker
*/
function createMarker(place, map, boolean) {
	if (!boolean) {
		return new google.maps.Marker({
			position: place.geometry.location,
			title: place.formatted_address,
			map: map
		});
	}
	else if (boolean) {
		return new google.maps.Marker({
			position: new google.maps.LatLng(place.geometry.location.lat, place.geometry.location.lng),
			title: place.formatted_address,
			map: map
		});
	}
}

/*
	In our Html we have a div with an arbitrary id for the google map canvas like id="map-canvas"
	We pass that id in here and this function sets that element to be our map and returns our map element
	sets the mapOptions to be an empty object
*/
function createMap(mapElementId) {
	return new google.maps.Map(document.getElementById(mapElementId), {});
}

/*
	Function that takes in our map element
	returns a placesService object for the google maps places library
	this object for example has a method called getDetails that takes in an object with 
	the key placeId and a callback that takes 2 parameters, place and status code
*/
function createPlacesService(map) {
	return new google.maps.places.PlacesService(map);
}

/*
	Function that takes in a object that has key-value pairs 
	of placeIds to their extraDetailsPlace object
	sets placesMapping[pid] = extraDetailsPlace object
*/
function getExtraDetails(placesMapping, place_id, service) {
	service.getDetails(obj, function(place, status) {
		
	});
}

/* 
	function that returns an empty bounds object

*/
function emptyBounds() {
	return new google.maps.LatLngBounds();
}

function createBounds(lat, lng) {

	return new google.maps.LatLngBounds(
		new google.maps.LatLng(lat, lng)
	);

}
function fitBounds(map, bounds) {
	map.fitBounds(bounds);
}

function createLatLngObject(lat, lng) {
	return new google.maps.LatLng(lat,lng);
}
function extendBounds(bounds, location) {
	bounds.extend(location);
}
/* 
	Adds a listener to the google map for example an onclick listener
	Possible map listeners (eventTypes) are below

	bounds_changed -> when the bounds of the map are changed
	center_changed -> when the center point of the map is changed
	click -> when the map is clicked
	dblclick -> when the map is double clicked
	drag -> when the map is dragged
	dragend -> not completely sure but I'm pretty sure this is when the drag event is over
	dragstart -> when the drag is started
	heading_changed -> not sure
	idle -> not sure
	maptypeid_changed -> the maptypeid is a view like roadmap, satellite or terrain
	mousemove -> when the mouse is moved on the map
	mouseout -> when the mouse moves out of the map
	mouseover -> when the mouse hovers over the map
	projection_changed -> not sue
	resize -> when the map is resized
	rightclick -> when the map is rightclicked
	tilesloaded -> when the map has fully loaded graphically
	tilt_changed -> not sure
	zoom_changed -> when the zoom level has changed
	places_changed -> when the user types in a value in the google map search box and theres at least one result

*/
function addMapListener(element, eventType, callBackFunction) {
	google.maps.event.addListener(element, eventType, callBackFunction);
}

function addDomListener(element, eventType, callBackFunction) {
	google.maps.event.addDomListener(element, eventType, callBackFunction);
}
/* 
	In order to use all the beautiful functionality of the google search box for our gmap search
	We declare an input box in our html, this function takes in the id of that element
	And turns that search box into the google maps search box and returns the googleSearchBoxElement
	We will add an event listener of places_changed and in the callback of this event we use
	our googleSearchBox element to call googleSearchBox.getPlaces() which returns a list of json objects

*/
function createGoogleSearch(searchElementId, map) {
	var inputSearch = document.getElementById(searchElementId);
	map.controls[google.maps.ControlPosition.TOP_LEFT].push(inputSearch);
	return new google.maps.places.SearchBox(inputSearch);		
}

/* 
 Function that takes in single place object user searched for
 a callback function to execute once results are in
 and a service object that contains the method search by radius
*/

function nearbySearchRadius(place, cb, service) {
	var request = {
    	location: place.geometry.location,
    	radius: '1600',
    	types: []
  	};

  	service.nearbySearch(request, cb);
}

function computeDistance(l1, l2) {
	return (google.maps.geometry.spherical.computeDistanceBetween(l1, l2) / 1000).toFixed(2);
}

/*function initializeMarkers(bounds, infoWindow, map) {
	var latlngObjects = [
							{coords: new google.maps.LatLng(41.881832,-87.623177), city: "Chicago, IL"},
							{coords: new google.maps.LatLng(42.168333,-87.851389), city: "Deerfield, IL"}, 
							{coords: new google.maps.LatLng(42.033360,-88.083405), city: "Schaumburg, IL"},
							{coords: new google.maps.LatLng(42.1825, -87.806944), city: "Highland Park, IL"},
							{coords: new google.maps.LatLng(42.129167, -87.840833), city: "NorthBrook, IL"}
						];

	latlngObjects.forEach(function(location) {
		var marker = createMarker(location.city,map,location.coords);
		addMarker(marker);
		extendBounds(bounds,location.coords);
		addMapListener(marker, 'click',function() {
			infoWindow.setContent(location.city);
			infoWindow.open(map, this);
		});
	});

	map.fitBounds(bounds);
}*/

