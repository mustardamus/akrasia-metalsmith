'use strict'

const Metalsmith = require('metalsmith')
const ignore = require('metalsmith-ignore')
const msIf = require('metalsmith-if')
const watch = require('metalsmith-watch')
const assets = require('metalsmith-assets')

Metalsmith(__dirname)
  .source('./src')
  .destination('./www')
  .clean(false)
  .use(ignore([ '**/*', '!assets/**/*' ]))
  .use(assets({
    source: './src/assets',
    destination: './assets'
  }))
  .use(msIf(
    process.argv.indexOf('--watch') !== -1, watch({
      paths: { '${source}/assets/**/*': true }
    })
  ))
  .build((err) => {
    if (err) {
      throw err
    }
  })
