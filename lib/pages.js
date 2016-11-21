'use strict'

const Metalsmith = require('metalsmith')
const ignore = require('metalsmith-ignore')
const msIf = require('metalsmith-if')
const watch = require('metalsmith-watch')
const permalinks = require('metalsmith-permalinks')
const layouts = require('metalsmith-layouts')
const minify = require('metalsmith-html-minifier')
const moveRemove = require('metalsmith-move-remove')
const moveUp = require('metalsmith-move-up')
const fs = require('fs')
const path = require('path')

let pageHomeDist = path.join(__dirname, '../www/pages/home/index.html')

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
  .use(msIf(
    fs.existsSync(pageHomeDist), moveRemove({
      move: [{ source: pageHomeDist, target: 'index.html' }]
    })
  ))
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
