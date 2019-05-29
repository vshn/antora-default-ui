; (function () {
  'use strict'

  function find (selector, from) {
    return [].slice.call((from || document).querySelectorAll(selector))
  }

  function removeAllChildren (div) {
    while (div.firstChild) {
      div.removeChild(div.firstChild)
    }
  }

  var allMain = find('.main')
  var allDocs = find('.doc')

  if (allMain.length !== 1 || allDocs.length !== 1) {
    console.error('Not found required elements in page')
    return
  }

  var main = allMain[0]
  var mainDoc = allDocs[0]

  if (!window['vshn_lunr_index']) {
    window['vshn_lunr_index'] = []
  }
  var lunrIndex = window['lunr'].Index.load(window['vshn_lunr_index'])

  var searchArticle = document.createElement('article')
  searchArticle.className = 'doc'
  var searchTitle = document.createElement('h1')
  searchTitle.innerText = 'Search Results'
  searchArticle.appendChild(searchTitle)

  function displayResults (results, div) {
    removeAllChildren(div)
    searchArticle.appendChild(searchTitle)
    if (results.length === 0) {
      var searchResult = document.createElement('p')
      searchResult.innerText = 'No results found'
      div.appendChild(searchResult)
    } else {
      results.forEach(function (item, idx) {
        var searchResult = document.createElement('p')
        var searchLink = document.createElement('a')
        searchLink.innerText = item.name
        searchLink.href = item.href
        searchResult.appendChild(searchLink)
        div.appendChild(searchResult)
      })
    }
  }

  var origin = window['vshn_lunr_files']
  find('#search-input').forEach(function (item, idx) {
    item.onkeyup = function () {
      var val = item.value
      if (val.length > 0) {
        if (!searchArticle.parentNode) {
          main.replaceChild(searchArticle, mainDoc)
        }
        var results = lunrIndex.search(val).map(function (result) {
          return origin[result.ref]
        })
        if (results.length > 0) {
          console.info('Found %s results', results.length)
          displayResults(results, searchArticle)
        } else {
          console.warn('No search results found')
          displayResults([], searchArticle)
        }
      } else {
        if (!mainDoc.parentNode) {
          main.replaceChild(mainDoc, searchArticle)
        }
      }
    }
  })
})()
