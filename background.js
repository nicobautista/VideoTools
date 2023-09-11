// Relay messages from the popup to content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	const type = request.type;
	const value = request.value;
	console.log(`background.js: Received ${type}: ${value}% from ${sender}`);
  
	// Relay the message to the content script of the sender tab based on the type
	chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
	  const tab = tabs[0];
	  chrome.tabs.sendMessage(tab.id, { type: type, value: value });
	});
  });
  