'use strict'

const Metalsmith = require('metalsmith')
const ignore = require('metalsmith-ignore')
const msIf = require('metalsmith-if')
const watch = require('metalsmith-watch')
const permalinks = require('metalsmith-permalinks')
const layouts = require('metalsmith-layouts')
const htmlMinifier = require('metalsmith-html-minifier')
const moveRemove = require('metalsmith-move-remove')

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
  .use(htmlMinifier({ removeAttributeQuotes: false }))
  .use(moveRemove({
    move: [{ source: 'pages/home/index.html', target: 'index.html' }]
  }))
  .use(msIf(
    process.argv.indexOf('--watch') !== -1, watch({
      paths: {
        '${source}/pages/*.html': true,
        '${source}/layouts/page.html': '*.html'
      }
    })
  ))
  .build((err) => {
    if (err) {
      throw err
    }
  })
