; (function () {
  'use strict'

  // Antora should allow to edit the "base URL" of a documentation set
  // somewhere in the antora.yml, but this is not yet available as of
  // version 2.0.
  // Hence, in this function (called in the button defined in
  // toolbar.hbs) we "rewrite" the URL passed (which is local to the
  // context used to create the site, usually with "file://" URLs) and we
  // redirect to the actual repository where the pages are stored.
  function vshnEditUrl () {
    var originalPath = window.location.pathname
    // The window.location.pathname property is a string with the following form:
    // '/handbook/1.0.0/your_first_day.html'
    // We match and extract the middle section.
    var re = new RegExp('^/handbook/(.*)/(.*).html$')

    /*
    At this point, "matches" is an array with the following structure:
    0: "/handbook/1.0.0/your_first_day.html"
    1: "1.0.0"
    2: "your_first_day"
    */
    var matches = originalPath.match(re)
    console.log(matches)
    if (matches.length > 2) {
      // Create the actual URL that points to the source of this file
      var newPath = 'https://git.vshn.net/vshn/handbook/tree/develop/modules/ROOT/pages/' + matches[2] + '.adoc'
      console.log(newPath)
      window.location = newPath
    } else {
      console.error('Could not redirect the user properly using URL:' + originalPath)
    }
  }

  // Reference to the "Edit this Page" button
  var editButton = document.querySelector('.vshn-page-edit')

  // Add an onclick event handler for the corresponding button on the UI
  editButton.onclick = function () {
    vshnEditUrl()
  }
})()
