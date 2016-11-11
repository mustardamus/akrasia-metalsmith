const $ = require('cash-dom')

const mobileMenuToggle = function () {
  let $menu = $('header .nav .nav-menu')

  $('header .nav .nav-toggle').on('click', () => {
    $menu.toggleClass('is-active')
  })
}

$(() => {
  mobileMenuToggle()
})
