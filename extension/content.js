// get the first link on the page

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // this is the value that we specified in background.js
    if( request.message === "clicked_browser_action" ) {

      // $ is an alias for the jQuery function (creates an object)
      // .eq selects the 0th element
      // .attr gets the attribute stored at "href"
      var firstHref = $("a[href^='http']").eq(0).attr("href");

      // print it out-- this only happens when the icon is clicked
      console.log(firstHref);
    }
  }
);