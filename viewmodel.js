function initializeKnockout() {
	window.mapViewModel = {
		placesVisited : ko.observableArray(),
		clickPlace : function(data, event) {
			log(data);
		},
		contains : function(placeId) {
			log("contains method running");
			var duplicateBoolean = false;
			ko.utils.arrayForEach(this.placesVisited(), function(place) {
				if (place.place_id == placeId) {
					duplicateBoolean = true;
					return;
				}
			})
			return duplicateBoolean;
		}
	};

	ko.applyBindings(mapViewModel);
}