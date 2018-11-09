// get the first link on the page

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // this is the value that we specified in background.js
    if( request.message === "clicked_browser_action" ) {

      // $ is an alias for the jQuery function (creates an object)
      // .eq selects the 0th element
      // .attr gets the attribute stored at "href"
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      // print it out--
      // remember, we only enter this function when the icon is clicked
      console.log(firstHref);

      // pass a message to background.js
      // the message is "open_new_tab"
      // we also pass some information: the first url that we found
      chrome.runtime.sendMessage({"message": "open_new_tab",
                                  "url": firstHref});
    }
  }
);