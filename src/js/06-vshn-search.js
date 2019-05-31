; (function () {
  'use strict'

  // Finds items in the page using a CSS selector
  function find (selector, from) {
    return [].slice.call((from || document).querySelectorAll(selector))
  }

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

  var allMain = find('.main')
  var allDocs = find('.doc')

  // Just to make sure that there is a place where to show search results
  if (allMain.length !== 1 || allDocs.length !== 1) {
    console.error('Not found required elements in page')
    return
  }

  var main = allMain[0]
  var mainDoc = allDocs[0]

  // Populate the index with a default value, just in case.
  if (!window['vshn_lunr_index']) {
    window['vshn_lunr_index'] = {}
  }
  var lunrIndex = window['lunr'].Index.load(window['vshn_lunr_index'])

  // Create a placeholder node to show search results
  var searchArticle = document.createElement('article')
  searchArticle.className = 'doc'
  var searchTitle = document.createElement('h1')
  searchArticle.appendChild(searchTitle)

  // Get information about the current URL of this page
  var website = window.location.protocol + '//' + window.location.host

  // Builds the list of search results on the node passed as parameter.
  // The results variable is an array of objects with 'name' and 'href' keys.
  function displayResults (results, node, query) {
    removeAllChildren(node)
    searchArticle.appendChild(searchTitle)
    searchTitle.innerText = 'Search Results for "' + query + '"'
    if (results.length === 0) {
      // If nothing to show:
      var searchResult = document.createElement('p')
      searchResult.innerText = 'No results found.'
      node.appendChild(searchResult)
    } else {
      // If there are results to show:
      results.forEach(function (item, idx) {
        var searchDiv = document.createElement('div')
        searchDiv.className = 'paragraph'
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

        searchDiv.appendChild(searchParagraph)
        node.appendChild(searchDiv)
      })
    }
  }

  // This variable contains an object whose keys
  // are 'href' paths, and the values are objects with 'name'
  // and 'href' keys.
  var origin = window['vshn_lunr_files']
  find('#search-input').forEach(function (item, idx) {
    // Add an event to be fired everytime the user presses a key
    item.onkeyup = function () {
      var query = item.value
      if (!isEmptyOrBlank(query)) {
        query = query.trim()
        // Display the search node instead of the current page
        if (!searchArticle.parentNode) {
          main.replaceChild(searchArticle, mainDoc)
        }
        // Search and look for the corresponding files
        var results = lunrIndex.search(query).map(function (result) {
          return origin[result.ref]
        })
        if (results.length > 0) {
          // Display the results on the page
          console.info('Found %s results', results.length)
          displayResults(results, searchArticle, query)
        } else {
          // Nothing found, don't show anything
          console.warn('No search results found')
          displayResults([], searchArticle, query)
        }
      } else {
        // Display the original node with the current page
        if (!mainDoc.parentNode) {
          main.replaceChild(mainDoc, searchArticle)
        }
      }
    }
  })
})()
