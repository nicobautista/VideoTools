// Store the current filter state for each filter type
let currentContrast = 100;
let currentBrightness = 100;
let currentSaturate = 100;

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  const type = request.type;
  const value = request.value;
//   console.log(`content.js: Received ${type}: ${value}% from ${sender}`);
  // Update the filter value based on the message type
  if (type === 'apply_contrast') {
    currentContrast = value;
  } else if (type === 'apply_brightness') {
    currentBrightness = value;
  } else if (type === 'apply_saturate') {
    currentSaturate = value;
  }

  // Apply the updated filters
  applyFilters();
});

// Function to update and apply filters
function applyFilters() {
	const targetElement = document.querySelector('video');
  
	if (targetElement) {
	  // Build the filter string based on the current filter values
	  const filterString = `contrast(${currentContrast}%) brightness(${currentBrightness}%) saturate(${currentSaturate}%)`;
	  // Apply the filter to the element
	  targetElement.style.filter = filterString;
	}
  }

// Initial application of filters
applyFilters();
