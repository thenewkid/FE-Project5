/* 
	This is a basic framework for using google maps
*/

/* 
	Initialize our array for holding markers
*/

var markers = [];

/*
	Helper function that takes in a google.maps.Marker object and adds it to markers
*/
function addMarker(marker) {
	markers.push(marker);
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

/* 
	Function for creating a marker, for now it will just take in 1 string, location object, and our map
*/
function createMarker(title, map, location) {
	return new google.maps.Marker({
		position: location,
		title: title,
		map: map
	});
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
	service.getDetails({placeId:place_id}, function(place, status) {
		if (google.maps.places.PlacesServiceStatus == google.maps.places.PlacesServiceStatus.OK)
			placesMapping[dd_replace("id", "id", place_id)] = place;
		else
			placesMapping[place_id] = undefined;
	});
}

/* 
	function that returns an empty bounds object

*/
function emptyBounds() {
	return new google.maps.LatLngBounds();
}

function fitBounds(map, bounds) {
	map.fitBounds(bounds);
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

