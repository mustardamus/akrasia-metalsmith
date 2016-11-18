/* global $ */

const validateEmail = function(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

$(() => {
  let $form = $('form')
  let $email = $('input[name="email"]')
  let $message = $('textarea[name="message"]')
  let $button = $('button')

  $form.on('submit', (e) => {
    let email = $email.val()
    let message = $message.val()

    if (email.length !== 0 && message.length !== 0 && validateEmail(email)) {
      $button.addClass('is-loading')
      $('.is-danger', $form).removeClass('is-danger')

      $.ajax({
        url: 'https://formspree.io/me@akrasia.me',
        method: 'POST',
        dataType: 'json',
        data: { email, message },
        success: () => {
          $button.removeClass('is-loading').text('Message has been sent!')
          $message.val('').focus()
        }
      })
    } else {
      if (email.length === 0 || !validateEmail(email)) {
        $email.addClass('is-danger')
      } else {
        $email.removeClass('is-danger')
      }

      if (message.length === 0) {
        $message.addClass('is-danger')
      } else {
        $message.removeClass('is-danger')
      }
    }

    e.preventDefault()
  })
})
