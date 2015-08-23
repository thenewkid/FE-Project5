function initializeKnockout(service) {
	window.mapViewModel = {
		self : this,
		placesVisited : ko.observableArray(),
		markers : ko.observableArray(),
		additionalDetailsPlaces : ko.observableArray(),
		currentPlaceNameForReviews : ko.observable(),
		currentReviews : ko.observableArray(),
		addMarker : function(marker) {this.markers.push(marker);},
		addPlace : function(place) {this.placesVisited.push(place);},
		addDetailsPlace : function(placeDetailsObject) {this.additionalDetailsPlaces.push(placeDetailsObject);},
		showMarker : function(place, event) {
			var markerMatch = mapViewModel.findMarker(place.formatted_address);
			markerMatch.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
				markerMatch.setAnimation(null);
			}, 3000);
		},
		showReviewsModal : function(place, event) {
			//for all these click functions I have, place arg is the same as this. log(this) == log(place). #Why
			mapViewModel.currentReviews(place.reviews);
			mapViewModel.currentPlaceNameForReviews(place.name);
			showModal("review-modal");
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
		},
		removeMarker : function(mkr) {
			this.markers.remove(mkr);
		},
		removePlaceVisited : function(place) {
			this.placesVisited.remove(place);
		},
		deleteListing : function(place, event) {
			//remove the place and remove the marker, if I didn't remove the marker then we wouldnt be able to add the place object back
			//I also want to change the color of marker to green and set its anmation to bounce for 3 seconds and then remove it
			//so easy psh
			mapViewModel.removePlaceVisited(place);
			var marker = mapViewModel.findMarker(place.formatted_address);
			marker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
				marker.setMap(null);
				mapViewModel.removeMarker(marker);
			}, 3000)

		}
	};

	ko.applyBindings(mapViewModel);
}