// The name of the file to be downloaded.
let imageFilename;
// The search results tab.
let mainTab;
// Where we are on the current page of results.
let index;
// DEBUGGING: Which page we're on.
let pages;
// How many images we've processed.
let numProcessed;
// The number of results on the main tab.
const NUM_RESULTS = 10;
// For testing. Only do the first n pages.
const MAX_PAGES = 3;
// How many to download before taking a break.
const MAX_CONSECUTIVE = 10;
// How long of a break to take.
const THROTTLE_TIME = 2000;

function getNextImage() {
    // We've reached the end of the page.
    if (index === NUM_RESULTS) {
	if (pages === MAX_PAGES) {
	    return;
	}
	index = 0;
	pages++;
	chrome.tabs.sendMessage(mainTab.id, {"message": "next_page_action"});
    }
    const sendNextRequest = () => {
	chrome.tabs.sendMessage(mainTab.id, {"message": "open_tab_action", "index": index});
	index++;
	numProcessed++;
    };
    // If we're at a throttle point, take a break before opening the next tab.
    if (numProcessed % MAX_CONSECUTIVE === 0) {
	setTimeout(sendNextRequest, THROTTLE_TIME);
    } else {
	sendNextRequest();
    }
}

function startExtension(tab) {
    // send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true},
        function(tabs) {

            // get the first tab
            var activeTab = tabs[0];
	    mainTab = activeTab;
	    index = 0;
	    pages = 0;
	    numProcessed = 0;
            // use the value ("clicked_browser_action") to identify the message
            // see content.js for where this is used
	    getNextImage();
        }
    );

    // listen for the message about the URL
    // notice this is similar syntax to the code in content.js
    chrome.runtime.onMessage.addListener(

        function(request, sender, sendResponse) {

            // if the message is telling us to expand the cover, let's do it
            // open that url in the same window (don't create a new tab!)
            if( request.message === "open_cover_tab" ) {
                // get the url from the request --> request.url
                // tell chrome to create a tab with that url
                chrome.tabs.create({"url": request.url});
            }

	    // This message tells us we want to download an image.
	    if( request.message === "download_cover_action" ) {
		imageFilename = request.imageName;
		// Trigger the download.
		chrome.downloads.download({"url": request.imageUrl});
		// Close the tab that sent this download request since we
		// have its info already.
		chrome.tabs.remove(sender.tab.id);
	    }

	    // This message tells us we're on the next page.
	    if( request.message === "main_page_loaded" ) {
		getNextImage();
	    }
        }
    );

}

// when the user clicks on the extension icon, 
// will enter the "saveHundredCovers" function
chrome.browserAction.onClicked.addListener(startExtension);

// Setting the filename on the download doesn't work. It is overridden
// by headers in the response. Instead suggest the correct filename here.
// Once we've made our suggestion, go to the next image.
function suggestFilename(downloadItem, suggest) {
    suggest({"filename": imageFilename});
    getNextImage();
};

chrome.downloads.onDeterminingFilename.addListener(suggestFilename);