/* global $ */

$(() => {
  $('#posts .post').on('click', function (e) {
    window.location = $('.title a', this).attr('href')
    e.preventDefault()
  })
})
