const $ = require('cash-dom')

window.$ = $ // make it available to other bundles without re-including

const mobileMenuToggle = function () {
  let $menu = $('header .nav .nav-menu')

  $('header .nav .nav-toggle').on('click', () => {
    $menu.toggleClass('is-active')
  })
}

$(() => {
  mobileMenuToggle()
})
