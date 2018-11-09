function downloadCover(tab) {

    // send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true},
        function(tabs) {

            // get the first tab
            var activeTab = tabs[0];

            // use the value ("clicked_browser_action") to identify the message
            // see content.js for where this is used
            chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
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
        }
        
    );

}


// when the user clicks on the extension icon, 
// will enter the "saveHundredCovers" function
chrome.browserAction.onClicked.addListener(
    downloadCover
);