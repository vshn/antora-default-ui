; (function () {
  'use strict'

  function find (selector, from) {
    return [].slice.call((from || document).querySelectorAll(selector))
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
  searchTitle.innerText = 'Search Results'
  searchArticle.appendChild(searchTitle)

  // Builds the list of search results on the node passed as parameter.
  // The results variable is an array of objects with 'name' and 'href' keys.
  function displayResults (results, node) {
    removeAllChildren(node)
    searchArticle.appendChild(searchTitle)
    if (results.length === 0) {
      // If nothing to show:
      var searchResult = document.createElement('p')
      searchResult.innerText = 'No results found'
      node.appendChild(searchResult)
    } else {
      // If there are results to show:
      results.forEach(function (item, idx) {
        var searchResult = document.createElement('p')
        var searchLink = document.createElement('a')
        searchLink.innerText = item.name
        searchLink.href = item.href
        searchResult.appendChild(searchLink)
        node.appendChild(searchResult)
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
      var val = item.value
      if (val.length > 0) {
        // Display the search node instead of the current page
        if (!searchArticle.parentNode) {
          main.replaceChild(searchArticle, mainDoc)
        }
        // Search and look for the corresponding files
        var results = lunrIndex.search(val).map(function (result) {
          return origin[result.ref]
        })
        if (results.length > 0) {
          // Display the results on the page
          console.info('Found %s results', results.length)
          displayResults(results, searchArticle)
        } else {
          // Nothing found, don't show anything
          console.warn('No search results found')
          displayResults([], searchArticle)
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
