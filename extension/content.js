// get the first link on the page
// $ is an alias for the jQuery function (creates an object)
// .eq selects the 0th element
// .attr gets the attribute stored at "href"
var firstHref = $("a[href^='http']").eq(0).attr("href");

// print the output
console.log(firstHref);