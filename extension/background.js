// when the user clicks, enter this function
chrome.browserAction.onClicked.addListener(function(tab) {

  // send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];

    // use the value ("clicked_browser_action") to identify the message
    // see content.js for where this is used
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});