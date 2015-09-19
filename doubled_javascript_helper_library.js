function replace(string, stringToReplace, replaceString) {
	return string.replace(stringToReplace, replaceString);
}
function ReplacementArgsNotEqualLength(msg) {
	this.message = msg;
	this.name = "ReplacementArgsNotEqualLength";
}
function replaceAll(string, strings, stringArgs) {
	if (strings.length !== stringArgs.length)
		throw new ReplacementArgsNotEqualLength("String Arrays Must Be Equal Length");
	
	stringCopy = string;
	for (var i = 0; i < strings.length; i++) {
		stringCopy = replace(stringCopy, strings[i], stringArgs[i]);
	}

	return stringCopy;
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
	return getElement(elementId).style.display === "";
}

function showModal(modalId) {
	$("#" + modalId).modal();
}

function closeModal(modalId) {
	$("#" + modalId).modal('hide');
}
function displayNone(elementId) {
	return getElement(elementId).style.display === "none";
}
function log(data) {
	console.log(data);
}

function logArgs(dataArray) {
	dataArray.forEach(function(d) {
		log(d);
	});
}
