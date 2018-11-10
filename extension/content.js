
// Content scripts are JavaScript files that run in the context of web pages.
// By using the standard Document Object Model (DOM),
// they can read details of the web pages the browser visits,
// or make changes to them.



// get the URL of the first cover on that page
// "read details"
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // this is the value that we specified in background.js
    if( request.message === "clicked_browser_action" ) {

      // start by finding all the links on the page
      var links = document.getElementsByClassName("Topicsresult"); // equivalent -> var links = $(".Topicsresult")
      var firstLink = links[0].getAttribute("href");

      // pass a message to background.js
      // the message is "open_new_tab"
      // we also pass some information: the first url that we found
      chrome.runtime.sendMessage({"message": "open_cover_tab",
                                  "url": firstLink});
    }
  }
);