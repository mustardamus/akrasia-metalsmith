const $ = require('jquery')

window.$ = $ // make it available to other bundles without re-including

const mobileMenuToggle = function () {
  let $menu = $('header .nav .nav-menu')

  $('header .nav .nav-toggle').on('click', () => {
    $menu.toggleClass('is-active')
  })
}

const gotoTopHelper = function () {
  let $window = $(window)
  let $body = $('html,body')
  let $gotoTopLink = $(`
    <div id="goto-top-link">
      <?xml version="1.0" encoding="utf-8"?>
      <!-- Generator: Adobe Illustrator 18.1.1, SVG Export Plug-In . SVG Version: 6.00 Build 0)  -->
      <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
      <svg version="1.1" id="Arrow_circled_up" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px"
        y="0px" viewBox="0 0 20 20" enable-background="new 0 0 20 20" xml:space="preserve">
      <path d="M10,0.4c-5.303,0-9.601,4.298-9.601,9.6c0,5.303,4.298,9.601,9.601,9.601c5.301,0,9.6-4.298,9.6-9.601
        C19.6,4.698,15.301,0.4,10,0.4z M9.999,17.6c-4.197,0-7.6-3.402-7.6-7.6s3.402-7.6,7.6-7.6S17.6,5.803,17.6,10
        S14.196,17.6,9.999,17.6z M10,5.5l4.5,4.5H12v4H8v-4H5.5L10,5.5z"/>
      </svg>
    </div>
  `)

  $gotoTopLink.appendTo('body').on('click', () => {
    $body.animate({ scrollTop: 0 }, 'fast')
  })

  $window.on('scroll', () => {
    if ($window.scrollTop() > 500) {
      $gotoTopLink.fadeIn('fast')
    } else {
      $gotoTopLink.fadeOut('fast')
    }
  })
}

$(() => {
  mobileMenuToggle()
  gotoTopHelper()
})
