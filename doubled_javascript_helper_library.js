function replace(string, stringToReplace, replaceString) {
	return string.replace(stringToReplace, replaceString);
}

function hide(elementId) {
	$("#" + elementId).hide();
}

function show(elementId) {
	$("#" + elementId).show();
}

function displayEqualsEmptyQuote(elementId) {
	return document.getElementById(elementId).style.display == "";
}