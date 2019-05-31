; (function () {
  'use strict'

  // Checks whether a string is empty, blank, null or undefined
  function isEmptyOrBlank (str) {
    return (!str || str.length === 0 || !str.trim())
  }

  // Removes all the children of a node passed as parameter
  function removeAllChildren (node) {
    while (node.firstChild) {
      node.removeChild(node.firstChild)
    }
  }

  // Creates the DOM structure of a single search result item
  // The website variable contains the current domain where this code is running.
  function createSearchResultsDiv (item, website) {
    var searchParagraph = document.createElement('p')
    searchParagraph.className = 'search-paragraph'

    var searchEntry = document.createElement('a')
    searchEntry.innerText = item.name
    searchEntry.href = item.href
    searchEntry.className = 'search-entry'
    searchParagraph.appendChild(searchEntry)

    var br1 = document.createElement('br')
    searchParagraph.appendChild(br1)

    var searchLink = document.createElement('a')
    searchLink.innerText = website + item.href
    searchLink.href = item.href
    searchLink.className = 'search-link'
    searchParagraph.appendChild(searchLink)

    var br2 = document.createElement('br')
    searchParagraph.appendChild(br2)

    var searchExcerpt = document.createElement('span')
    searchExcerpt.className = 'search-excerpt'
    searchExcerpt.innerText = item.excerpt
    searchParagraph.appendChild(searchExcerpt)

    var searchDiv = document.createElement('div')
    searchDiv.className = 'search-div paragraph'
    searchDiv.onclick = function () {
      window.location.href = item.href
    }
    searchDiv.appendChild(searchParagraph)
    return searchDiv
  }

  // Builds the HTML structure of the list of search results
  // The results variable is an array of objects with 'name', 'href' and 'excerpt' keys.
  // The query variable is a string entered by the user.
  function display (results, query) {
    if (isEmptyOrBlank(query)) {
      // Display the original page in lieu of the search results if not done yet
      if (!mainDoc.parentNode) {
        main.replaceChild(mainDoc, searchArticle)
      }
      return
    }
    // Rebuild the contents of the "search results" page
    removeAllChildren(searchArticle)
    var searchTitle = document.createElement('h1')
    searchArticle.appendChild(searchTitle)
    searchTitle.innerText = 'Search Results for "' + query.trim() + '"'
    if (results.length === 0) {
      var searchResult = document.createElement('p')
      searchResult.innerText = 'No results found.'
      searchArticle.appendChild(searchResult)
    } else {
      results.forEach(function (item, idx) {
        var searchDiv = createSearchResultsDiv(item, website)
        searchArticle.appendChild(searchDiv)
      })
    }
    // Replace the current page with a "search results" page if not done yet
    if (!searchArticle.parentNode) {
      main.replaceChild(searchArticle, mainDoc)
    }
  }

  // Performs the actual search
  function search (query) {
    if (isEmptyOrBlank(query)) {
      return []
    }
    // Search with Lunr.js, but return at most 10 items.
    var results = lunrIndex.search(query.trim()).slice(0, 10).map(function (result) {
      return origin[result.ref]
    })
    return results
  }

  var main = document.querySelector('.main')
  var mainDoc = document.querySelector('.doc')
  var searchInput = document.querySelector('#search-input')

  // Just to make sure that there is a place where to show search results
  if (!main || !mainDoc || !searchInput) {
    console.error('Not found required elements in page with CSS classes "main" and "doc",')
    console.error('or a text field with ID "search-input".')
    return
  }

  // The index is generated and optimized at the moment of build.
  // Populate the index with a default value, just in case.
  if (!window['vshn_lunr_index']) {
    window['vshn_lunr_index'] = {}
  }
  var lunrIndex = window['lunr'].Index.load(window['vshn_lunr_index'])
  var website = window.location.protocol + '//' + window.location.host

  // This variable contains an object whose keys are 'href' paths,
  // and the values are objects with 'name', 'excerpt' and 'href' keys.
  // We need this because the Lunr.js index does _not_ return any
  // other information than the 'href' when searching; we need to
  // map that 'href' to information that makes sense to the user,
  // like contents and excerpts.
  var origin = window['vshn_lunr_files']

  // Create a placeholder node to show search results
  var searchArticle = document.createElement('article')
  searchArticle.className = 'doc'

  // Event to be fired everytime the user presses a key
  searchInput.onkeyup = function () {
    var query = searchInput.value
    var results = search(query)
    display(results, query)
  }

  // Event to be fired when the input gains focus
  searchInput.onfocus = function () {
    var query = searchInput.value
    var results = search(query)
    display(results, query)
  }

  // Focus the search box when the page loads
  window.onload = function (e) {
    searchInput.focus()
  }
})()
