function initializeMap() {

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
	addMapListener(googleMapSearch, 'places_changed', placesChangedCallBack)

}

/*
	add the map listener to call our intializeMap function when the window loads
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

*/
function tilesLoadedCallBack() {
	if (displayEqualsEmptyQuote("google-search"))
		show("google-search");
}

/* 
	This function gets run every time the user types in a query and hits enter
*/
function placesChangedCallBack() {
	
}

