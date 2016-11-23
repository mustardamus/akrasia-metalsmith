'use strict'

const Metalsmith = require('metalsmith')
const ignore = require('metalsmith-ignore')
const msIf = require('metalsmith-if')
const watch = require('metalsmith-watch')
const permalinks = require('metalsmith-permalinks')
const layouts = require('metalsmith-layouts')
const minify = require('metalsmith-html-minifier')
const moveUp = require('metalsmith-move-up')

Metalsmith(__dirname)
  .source('../src')
  .destination('../www')
  .clean(false)
  .use(ignore([ '**/*', '!pages/**/*.html' ]))
  .use(permalinks())
  .use(layouts({
    engine: 'ejs',
    directory: '../src/layouts',
    default: 'page.html'
  }))
  .use(minify({ removeAttributeQuotes: false }))
  .use(moveUp('pages/**/*'))
  .use(msIf(
    process.argv.indexOf('--watch') !== -1, watch({
      paths: {
        '${source}/pages/*.html': true,
        '${source}/layouts/page.html': '**/pages/*.html',
        '${source}/partials/*.html': '**/pages/*.html'
      }
    })
  ))
  .build((err) => {
    if (err) {
      throw err
    }
  })
