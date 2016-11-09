'use strict'

const Metalsmith = require('metalsmith')
const ignore = require('metalsmith-ignore')
const msIf = require('metalsmith-if')
const watch = require('metalsmith-watch')
const stylus = require('metalsmith-stylus')
const autoprefixer = require('autoprefixer-stylus')
const minify = require('metalsmith-clean-css')

Metalsmith(__dirname)
  .source('./src')
  .destination('./www')
  .clean(false)
  .use(ignore([ '**/*', '!css/index.styl' ]))
  .use(stylus({
    use: [autoprefixer()],
    'include css': true,
    include: './src/css'
  }))
  .use(minify())
  .use(msIf(
    process.argv.indexOf('--watch') !== -1, watch({
      paths: { '${source}/css/*.styl': true }
    })
  ))
  .build((err) => {
    if (err) {
      throw err
    }
  })
