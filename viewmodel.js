function initializeKnockout() {
	window.mapViewModel = {
		placesVisited : ko.observableArray(), 
	};

	ko.applyBindings(mapViewModel);
}