'use strict'

const Metalsmith = require('metalsmith')
const ignore = require('metalsmith-ignore')
const msIf = require('metalsmith-if')
const watch = require('metalsmith-watch')
const permalinks = require('metalsmith-permalinks')
const layouts = require('metalsmith-layouts')
const moveRemove = require('metalsmith-move-remove')

Metalsmith(__dirname)
  .source('./src')
  .destination('./www')
  .clean(false)
  .use(ignore([ '**/*', '!pages/**/*.html' ]))
  .use(permalinks())
  .use(layouts({
    engine: 'handlebars',
    directory: 'src/layouts',
    partials: 'src/partials',
    default: 'page.html'
  }))
  .use(moveRemove({
    move: [{ source: 'pages/home/index.html', target: 'index.html' }]
  }))
  .use(msIf(
    process.argv.indexOf('--watch') !== -1, watch({
      paths: {
        '${source}/pages/*.html': true,
        '${source}/layouts/post.html': '*.html'
      }
    })
  ))
  .build((err) => {
    if (err) {
      throw err
    }
  })
