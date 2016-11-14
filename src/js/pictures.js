/* global $ */

$(() => {
  let $cities = $('#cities')
  let $sidebar = $('#sidebar')
  let $toggleCities = $('#view-toggle-cities')
  let $togglePictures = $('#view-toggle-pictures')
  let $modal = $('#picture-show-modal')
  let citiesMenuHeight = $('#cities-menu').height()

  $('.city-cover').on('click', function () {
    $(this).parent().toggleClass('is-active')
  })

  $toggleCities.on('click', () => {
    $cities.removeClass('only-pictures')
    $toggleCities.addClass('is-active')
    $togglePictures.removeClass('is-active')
  })

  $togglePictures.on('click', () => {
    $cities.addClass('only-pictures')
    $togglePictures.addClass('is-active')
    $toggleCities.removeClass('is-active')
  })

  $(window).on('scroll', () => {
    let top = window.pageYOffset || document.documentElement.scrollTop

    if (top > citiesMenuHeight) {
      $sidebar.addClass('top-link')
    } else {
      $sidebar.removeClass('top-link')
    }
  })

  $cities.find('a').on('click', function (e) {
    $modal.find('img').attr('src', this.href)
    $modal.addClass('is-active')
    e.preventDefault()
  })

  $modal.find('.modal-close, .modal-background, img').on('click', () => {
    $modal.removeClass('is-active')
  })
})
