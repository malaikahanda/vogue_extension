
// Content scripts are JavaScript files that run in the context of web pages.
// By using the standard Document Object Model (DOM),
// they can read details of the web pages the browser visits,
// or make changes to them.



// get the URL of the first cover on that page
// "read details"

window.onload = function() {
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
	
	var imageName = volume+"_"+issue+"_"+day+month+year+".jpg";
	return(imageName);
    }
	
    // what to do on the new tab:
    
    var imageName = getImageName();
    var imageURL = document
        .getElementsByClassName("fullPageImage")[0]
        .src;
    // Send back info to background page so it can do the download.
    chrome.runtime.sendMessage({"message": "download_cover_action", "imageName": imageName, "imageUrl": imageURL});
}