// when the user clicks, use the function
chrome.browserAction.onClicked.addListener(

    // use this function after clicking!
    function(tab) {

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

                // if the message is telling us to open a new tab, let's do it
                if( request.message === "open_new_tab" ) {
                    // get the url from the request --> request.url
                    // tell chrome to create a tab with that url
                    chrome.tabs.create({"url": request.url});
                }
            }
            
        );

    }

);