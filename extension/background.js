// create an image name: vol#_issue#_ddmmyyyy.png
function getImageName() {
    // get vol and issue
    var volumeIssueList = document
        .getElementsByClassName("issue_num_spacing")[0]
        .innerHTML
        .split("&nbsp;");
    var volume = parseInt(volumeIssueList[2]).toString();
    var issue = parseInt(volumeIssueList[4]).toString();

    // get date
    var monthMap = {"Jan": "01", "Feb": "02", "Mar": "03", "Apr": "04",
                    "May": "05", "Jun": "06", "Jul": "07", "Aug": "08",
                    "Sep": "09", "Oct": "10", "Nov": "11", "Dec": "12"}
    var dateList = document
        .getElementsByClassName("titleAuthorETC")[0]
        .innerText
        .split(" ");
    var month = monthMap[dateList[3].replace("(", "")];
    var day = ("0" + parseInt(dateList[4]).toString()).slice(-2);
    var year = parseInt(dateList[5]).toString();

    var imageName = `${volume}_${issue}_${day}${month}${year}`;
    return(imageName);
}

// what to do on the new tab:
// download the image with the image name
function downloadCover(tab) {

    var imageName = getImageName();
    var imageURL = document
        .getElementsByClassName("fullPageImage")[0]
        .src;
    chrome.downloads.download({"url": imageURL, "filename": imageName});

}


function openTab(tab) {

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
                chrome.tabs.create(
                    {"url": request.url},
                    (tab) => {chrome.tabs.executeScript(tab.id, {"code": downloadCover})}
                );
            }
        }
        
    );

}

// when the user clicks on the extension icon, 
// will enter the "saveHundredCovers" function
chrome.browserAction.onClicked.addListener(
    openTab
);