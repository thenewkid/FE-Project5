function initializeKnockout(service) {
	window.mapViewModel = {
		self : this,
		placesVisited : ko.observableArray(),
		markers : ko.observableArray(),
		additionalDetailsPlaces : ko.observableArray(),
		addMarker : function(marker) {this.markers.push(marker);},
		addPlace : function(place) {this.placesVisited.push(place);},
		addDetailsPlace : function(placeDetailsObject) {this.additionalDetailsPlaces.push(placeDetailsObject);},
		showMarker : function(place, event) {
			var markerMatch = mapViewModel.findMarker(place.formatted_address);
			markerMatch.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
				markerMatch.setAnimation(null);
			}, 3000)
		
		},
		requestDetails : function(place, event) {
			if (!mapViewModel.containsPlaceDetails(place.place_id))
				requestPlaceDetails(place,service);
		},
		containsPlaceDetails : function(pid) {
			var duplicateBoolean = false;
			ko.utils.arrayForEach(this.additionalDetailsPlaces(), function(place) {
				if (place.place_id == pid) {
					duplicateBoolean = true;
					return;
				}
			});
			return duplicateBoolean;
		},
		containsPlaceDetailsByName : function(name) {
			var duplicateBoolean = false;
			ko.utils.arrayForEach(this.additionalDetailsPlaces(), function(place) {
				if (place.name == name) {
					duplicateBoolean = true;
					return;
				}
			});
			return duplicateBoolean;
		},
		containsPlace : function(placeId) {
			var duplicateBoolean = false;
			ko.utils.arrayForEach(this.placesVisited(), function(place) {
				if (place.place_id == placeId) {
					duplicateBoolean = true;
					return;
				}
			})
			return duplicateBoolean;
		},
		containsMarker : function(title) {
			var duplicateBoolean = false;
			ko.utils.arrayForEach(this.markers(), function(marker) {
				if (marker.title == title) {
					duplicateBoolean = true;
					return;
				}
			});
			return duplicateBoolean;
		},
		findMarker : function(title) {
			return mkr = ko.utils.arrayFirst(this.markers(), function(marker) {
				return marker.title == title;
			});
		}
	};

	ko.applyBindings(mapViewModel);
}