// Initialize slider values from storage when the popup is opened
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
	const tabId = tabs[0].id;
	retrieveSliderValues(tabId, function (sliderValues) {
		// console.log(`Retrived from tab_${tabId}_sliders: ${JSON.stringify(sliderValues)}`);
		document.getElementById('contrast-slider').value = sliderValues.contrastValue || 100;
		document.getElementById('brightness-slider').value = sliderValues.brightnessValue || 100;
		document.getElementById('saturate-slider').value = sliderValues.saturateValue || 100;
	});
});

// Send messages to the active tab's content script for each slider
document.getElementById('contrast-slider').addEventListener('input', function () {
	const contrastValue = this.value;
	sendMessageToContentScript('apply_contrast', contrastValue);
	saveSliderValue('contrastValue', contrastValue);
});

document.getElementById('brightness-slider').addEventListener('input', function () {
	const brightnessValue = this.value;
	sendMessageToContentScript('apply_brightness', brightnessValue);
	saveSliderValue('brightnessValue', brightnessValue);
});

document.getElementById('saturate-slider').addEventListener('input', function () {
	const saturateValue = this.value;
	sendMessageToContentScript('apply_saturate', saturateValue);
	saveSliderValue('saturateValue', saturateValue);
});

// Event Listeners for home buttons
document.getElementById('reset-contrast').addEventListener('click', function () {
	document.getElementById('contrast-slider').value = 100;
	sendMessageToContentScript('apply_contrast', 100);
	saveSliderValue('contrastValue', 100);
});

document.getElementById('reset-brightness').addEventListener('click', function () {
	document.getElementById('brightness-slider').value = 100;
	sendMessageToContentScript('apply_brightness', 100);
	saveSliderValue('brightnessValue', 100);
});

document.getElementById('reset-saturation').addEventListener('click', function () {
	document.getElementById('saturate-slider').value = 100;
	sendMessageToContentScript('apply_saturate', 100);
	saveSliderValue('saturateValue', 100);
});

// Helper function to send a message to the active tab's content script
function sendMessageToContentScript(type, value) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		const tab = tabs[0];
		chrome.tabs.sendMessage(tab.id, { type: type, value: value });
	});
}

// Helper function to save slider values to storage for the active tab
function saveSliderValue(key, value) {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		const tabId = tabs[0].id;
		retrieveSliderValues(tabId, function (sliderValues) {
			sliderValues[key] = value;
			chrome.storage.local.set({ [`tab_${tabId}_sliders`]: sliderValues });
		});
	});
}

// Helper function to retrieve slider values from storage for the active tab
function retrieveSliderValues(tabId, callback) {
	chrome.storage.local.get([`tab_${tabId}_sliders`], function (result) {
		callback(result[`tab_${tabId}_sliders`] || {});
	});
}