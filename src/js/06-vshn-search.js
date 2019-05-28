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

  var documents = [{
    'name': 'Lunr',
    'text': 'Like Solr, but much smaller, and not as bright.',
  }, {
    'name': 'React',
    'text': 'A JavaScript library for building user interfaces.',
  }, {
    'name': 'Lodash',
    'text': 'A modern JavaScript utility library delivering modularity, performance & extras.',
  }]
  var lunrIndex = window['lunr'](function () {
    this.ref('name')
    this.field('text')
    this.metadataWhitelist = ['name']

    documents.forEach(function (d) {
      this.add(d)
    }, this)
  })

  var searchArticle = document.createElement('article')
  searchArticle.className = 'doc'
  var searchTitle = document.createElement('h1')
  searchTitle.innerText = 'Search Results'
  searchArticle.appendChild(searchTitle)

  function displayResults (results, div) {
    removeAllChildren(div)
    searchArticle.appendChild(searchTitle)
    results.forEach(function (item, idx) {
      var searchResult = document.createElement('p')
      searchResult.innerText = item.ref
      div.appendChild(searchResult)
    })
  }

  find('#search-input').forEach(function (item, idx) {
    item.onkeyup = function () {
      var val = item.value
      if (val.length > 0) {
        if (!searchArticle.parentNode) {
          main.replaceChild(searchArticle, mainDoc)
        }
        var results = lunrIndex.search(val)
        if (results.length > 0) {
          console.info('Found %s results', results.length)
          displayResults(results, searchArticle)
        } else {
          console.warn('No search results found')
          displayResults([{ ref: 'No results found' }], searchArticle)
        }
      } else {
        if (!mainDoc.parentNode) {
          main.replaceChild(mainDoc, searchArticle)
        }
      }
    }
  })
})()
