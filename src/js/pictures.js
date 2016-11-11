/* global $ */

$(() => {
  $('.city-cover').on('click', function () {
    $(this).parent().toggleClass('is-active')
  })
})
