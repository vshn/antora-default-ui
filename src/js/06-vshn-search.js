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
      if (!mainArticle.parentNode) {
        contentDiv.replaceChild(mainArticle, searchArticle)
        toc.style.visibility = 'visible'
      }
      return
    }
    // Rebuild the contents of the "search results" page
    removeAllChildren(searchArticle)
    var searchTitle = document.createElement('h1')
    searchTitle.className = 'page'
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
      toc.style.visibility = 'hidden'
      contentDiv.replaceChild(searchArticle, mainArticle)
    }
  }

  // Performs the actual search
  function search (query, callback) {
    var XMLHttpRequest = window.XMLHttpRequest
    var xmlhttp = new XMLHttpRequest()

    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === XMLHttpRequest.DONE) {
        if (xmlhttp.status === 200) {
          console.log(xmlhttp.responseText)
          callback(JSON.parse(xmlhttp.responseText))
        } else {
          console.log('Status received: ' + xmlhttp.status)
          callback(JSON.parse('[{"name":"Advanced Config Reference","href":"/k8up/0.1.5/advanced-config.html","excerpt":" The operator has two ways for configuration:  Per namespace backups. Optimal for shared clusters Global settings with namespaced…"},{"name":"K8up","href":"/k8up/0.1.5/index.html","excerpt":" K8up is a backup operator that will handle PVC and app backups on a k8s/OpenShift cluster. Just create a…"},{"name":"Getting Started Tutorial","href":"/k8up/0.1.5/getting-started.html","excerpt":" This tutorial provides a quick introduction to K8up, how it works and how to use it.  Prerequisites This…"},{"name":"Object Specifications Reference","href":"/k8up/0.1.5/object-specifications.html","excerpt":" The K8up operator includes various CRDs which get added to the cluster. Here We’ll explain them in more detail.…"},{"name":"How to Restore a Backup","href":"/k8up/0.1.5/restore.html","excerpt":" It is possible to tell the operator to perform restores either to a PVC or an S3 bucket. For…"}]'))
        }
      }
    }

    var url = '/search?q=' + encodeURIComponent(query)
    xmlhttp.open('GET', url, true)
    xmlhttp.send()
  }

  var contentDiv = document.querySelector('.content')
  var mainArticle = document.querySelector('.doc')
  var searchInput = document.querySelector('#search-input')
  var toc = document.querySelector('.sidebar')
  var website = window.location.protocol + '//' + window.location.host

  // Just to make sure that there is a place where to show search results
  if (!contentDiv || !mainArticle || !searchInput || !toc) {
    console.error('Not found required elements in page with CSS classes "main" and "doc",')
    console.error('or a text field with ID "search-input".')
    return
  }

  // Create a placeholder node to show search results
  var searchArticle = document.createElement('article')
  searchArticle.className = 'doc'

  // Event to be fired everytime the user presses a key
  searchInput.onkeyup = function () {
    var query = searchInput.value
    search(query, function (results) {
      display(results, query)
    })
  }

  // Event to be fired when the input gains focus
  // searchInput.onfocus = function () {
  //   var query = searchInput.value
  //   search(query, function (results) {
  //     display(results, query)
  //   })
  // }

  // Focus the search box when the page loads
  // window.onload = function (e) {
  //   searchInput.focus()
  // }
})()
