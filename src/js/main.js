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
      Goto Top
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
