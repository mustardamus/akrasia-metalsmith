/* global $ */

$(() => {
  let $cities = $('#cities')
  let $toggleCities = $('#view-toggle-cities')
  let $togglePictures = $('#view-toggle-pictures')

  $('.city-cover').on('click', function () {
    $(this).parent().toggleClass('is-active')
  })

  $toggleCities.on('click', function () {
    $cities.removeClass('only-pictures')
    $toggleCities.addClass('is-active')
    $togglePictures.removeClass('is-active')
  })

  $togglePictures.on('click', function () {
    $cities.addClass('only-pictures')
    $togglePictures.addClass('is-active')
    $toggleCities.removeClass('is-active')
  })
})
