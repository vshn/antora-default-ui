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
    searchDiv.className = 'paragraph'
    searchDiv.appendChild(searchParagraph)
    return searchDiv
  }

  // Builds the list of search results on the node passed as parameter.
  // The results variable is an array of objects with 'name' and 'href' keys.
  function displayResults (results, query) {
    removeAllChildren(searchArticle)
    searchArticle.appendChild(searchTitle)
    searchTitle.innerText = 'Search Results for "' + query + '"'
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
  }

  // Performs the actual search and drives the display of results
  function searchAndDisplay (query) {
    if (!isEmptyOrBlank(query)) {
      query = query.trim()
      // Replace the current page with a "search results" page
      if (!searchArticle.parentNode) {
        main.replaceChild(searchArticle, mainDoc)
      }
      // Search and look for the corresponding files, but return at most 10 items
      var results = lunrIndex.search(query).slice(0, 10).map(function (result) {
        return origin[result.ref]
      })
      displayResults(results, query)
    } else {
      // Display the original page in lieu of the search results
      if (!mainDoc.parentNode) {
        main.replaceChild(mainDoc, searchArticle)
      }
    }
  }

  var main = document.querySelector('.main')
  var mainDoc = document.querySelector('.doc')

  // Just to make sure that there is a place where to show search results
  if (!main || !mainDoc) {
    console.error('Not found required elements in page with CSS classes "main" and "doc".')
    return
  }

  // The index is generated and optimized at the moment of build.
  // Populate the index with a default value, just in case.
  if (!window['vshn_lunr_index']) {
    window['vshn_lunr_index'] = {}
  }
  var lunrIndex = window['lunr'].Index.load(window['vshn_lunr_index'])
  var website = window.location.protocol + '//' + window.location.host

  // This variable contains an object whose keys
  // are 'href' paths, and the values are objects with 'name'
  // and 'href' keys.
  var origin = window['vshn_lunr_files']

  // Create a placeholder node to show search results
  var searchArticle = document.createElement('article')
  searchArticle.className = 'doc'
  var searchTitle = document.createElement('h1')
  searchArticle.appendChild(searchTitle)

  // Find a reference to the input box used to enter search terms
  var searchInput = document.querySelector('#search-input')

  // Event to be fired everytime the user presses a key
  searchInput.onkeyup = function () {
    searchAndDisplay(searchInput.value)
  }

  // Event to be fired when the input gains focus
  searchInput.onfocus = function () {
    searchAndDisplay(searchInput.value)
  }

  // Focus the search box when the page loads
  window.onload = function (e) {
    searchInput.focus()
  }
})()
