; (function () {
  'use strict'

  // Antora allows to edit the "base URL" of a documentation set
  // in the playbook.yml file.

  // Reference to the "Edit this Page" button
  var editButton = document.querySelector('.vshn-page-edit')

  // Add an onclick event handler for the corresponding button on the UI
  editButton.onclick = function () {
    if (editButton.dataset.url) {
      window.location = editButton.dataset.url
    }
  }
})()
