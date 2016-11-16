/* global $ */

$(() => {
  let $cities = $('#cities')
  let $toggleCities = $('#view-toggle-cities')
  let $togglePictures = $('#view-toggle-pictures')
  let $modal = $('#picture-show-modal')

  const loadThumbs = ($parent) => {
    for (let img of $('img[data-src]', $parent)) {
      let $img = $(img)
      let src = $img.data('src')

      $img.attr({ src, 'data-src': null })
    }
  }

  $('.city-cover').on('click', function () {
    let $parent = $(this).parent()

    if ($parent.hasClass('is-active')) {
      $parent.removeClass('is-active')
    } else {
      $parent.addClass('is-active')
      loadThumbs($parent)
    }
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
    loadThumbs($cities)
  })

  $('a', $cities).on('click', function (e) {
    $('img', $modal).attr('src', this.href)
    $modal.addClass('is-active')
    e.preventDefault()
  })

  $('.modal-close, .modal-background, img', $modal).on('click', () => {
    $modal.removeClass('is-active')
  })
})
