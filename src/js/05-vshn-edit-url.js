; (function () {
  'use strict'

  // Antora should allow to edit the "base URL" of a documentation set
  // somewhere in the antora.yml, but this is not yet available as of
  // version 2.0.
  // Hence, in this function (called in the button defined in
  // toolbar.hbs) we "rewrite" the URL passed (which is local to the
  // context used to create the site, usually with "file://" URLs) and we
  // redirect to the actual repository where the pages are stored.
  function vshnEditUrl (originalPath) {
    // The originalPath variable has a string with the following form:
    // 'file:///home/user/path/handbook/modules/ROOT/pages/squads.adoc'
    // We match "*/modules/ROOT/pages/*" and extract the middle section.
    var re = new RegExp('^(.*)modules/ROOT/pages/(.*)$')

    /*
    At this point, "matches" is an array with the following structure:
    0: "file:///home/user/path/handbook/modules/ROOT/pages/squads.adoc"
    1: "file:///home/user/path/handbook/"
    2: "squads.adoc"
    */
    var matches = originalPath.match(re)
    if (matches.length > 2) {
      // Create the actual URL that points to the source of this file
      var somewhere = matches[0].replace(matches[1], '')
      var newPath = 'https://git.vshn.net/vshn/handbook/tree/develop/' + somewhere
      window.location = newPath
    } else {
      console.error('Could not redirect the user properly using URL:' + originalPath)
    }
  }

  function find (selector, from) {
    return [].slice.call((from || document).querySelectorAll(selector))
  }

  // Add an onclick event handler for the corresponding button on the UI
  find('.vshn-page-edit').forEach(function (item, idx) {
    var path = item.dataset.url
    item.onclick = function () {
      vshnEditUrl(path)
    }
  })
})()
