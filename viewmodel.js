function initializeKnockout(service, bounds, infoWindow, map) {
	window.mapViewModel = {
		placesVisited : ko.observableArray(),
		markers : ko.observableArray(),
		additionalDetailsPlaces : ko.observableArray(),
		currentPlaceNameForReviews : ko.observable(),
		currentReviews : ko.observableArray(),
		currentRadius : ko.observable(),
		radiusError : ko.observable(),
		currentPlaceForNearbySearch : ko.observable(),
		currentPlaceNameForNearbySearch : ko.observable(),
		nearbySearchResults : ko.observableArray(),
		nearbyDetailsSearchResults : ko.observableArray(),
		addNearbyDetailsPlace : function(doit) {this.nearbyDetailsSearchResults.push(doit);},
		addMarker : function(marker) {this.markers.push(marker);},
		addPlace : function(place) {this.placesVisited.push(place);},
		addNearbySearchResult : function(result) {this.nearbySearchResults.push(result);},
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
			mapViewModel.displayMarkerDeletion(marker);

		},
		displayMarkerDeletion : function(marker) {
			marker.setIcon("http://maps.google.com/mapfiles/ms/icons/green-dot.png");
			marker.setAnimation(google.maps.Animation.BOUNCE);
			setTimeout(function() {
				marker.setMap(null);
				mapViewModel.removeMarker(marker);
			}, 3000)
		},
		deleteAllListings : function() {
			/* a sane person might think, oh look at that deleteListing function,
				how about we iterate over places visited and call the deleteListing function on each place
				BAD BAD BAD IDEA BRO, in all programming languages, weird things start to happen when you remove an elemtn from a list
				as you iterate over the list, in java this is called ConcurrentModifcationException
				anyways I have a better solution, call the removeAll on placesVisited, then iterate over our markers and call
				displayMarkerDeletion. #peace
			 */

			 //we dont want to run any unecessary code so make sure at least placesVisited doesnt have a length
			 //0f zero before They get deleted
			 if (mapViewModel.placesVisited().length > 0) {
				mapViewModel.placesVisited.removeAll();
				mapViewModel.additionalDetailsPlaces.removeAll();
				mapViewModel.nearbyDetailsSearchResults.removeAll();
				mapViewModel.nearbySearchResults.removeAll();
				ko.utils.arrayForEach(mapViewModel.markers(), function(marker) {
					mapViewModel.displayMarkerDeletion(marker);
				});
				hide("nearby-search-results");
			}
			
		},
		requestNearbyDetails : function(place) {
			var match = ko.utils.arrayFirst(mapViewModel.nearbyDetailsSearchResults(), function(p) {
				return p.place_id == place.place_id
			});

			mapViewModel.addDetailsPlace(match);
		},
		searchNearby : function(place, event) {
			showModal("search-nearby-modal");
			mapViewModel.currentPlaceForNearbySearch(place);
			mapViewModel.currentPlaceNameForNearbySearch(place.name);
		},
		loadNearbySearchResults : function() {
			var cr = parseInt(mapViewModel.currentRadius());
			if (isNaN(cr))
				mapViewModel.radiusError("A number is required");
			else {
				if (displayEqualsEmptyQuote("nearby-search-results") || displayNone("nearby-search-results"))
					show("nearby-search-results");

				else if (mapViewModel.nearbySearchResults().length > 0) {
					mapViewModel.nearbySearchResults.removeAll();
				}

				nearbySearchRadius(mapViewModel.currentPlaceForNearbySearch(), service, mapViewModel.currentRadius(), bounds, infoWindow, map);

				closeModal("search-nearby-modal");
			}
				
		}

	};

	ko.applyBindings(mapViewModel);
}