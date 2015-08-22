function replace(string, stringToReplace, replaceString) {
	return string.replace(stringToReplace, replaceString);
}

function hide(elementId) {
	$("#" + elementId).hide();
}

function show(elementId) {
	$("#" + elementId).show();
}

function getElement(eid) {
	return document.getElementById(eid);
}

function displayEqualsEmptyQuote(elementId) {
	return getElement(elementId).style.display == "";
}

function displayNone(elementId) {
	return getElement(elementId).style.display == "none";
}
function log(data) {
	console.log(data);
}

function logArgs(dataArray) {
	dataArray.forEach(function(d) {
		log(d);
	})
}
