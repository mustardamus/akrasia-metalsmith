'use strict'

const path = require('path')
const Metalsmith = require('metalsmith')
const ignore = require('metalsmith-ignore')
const msIf = require('metalsmith-if')
const watch = require('metalsmith-watch')
const uglify = require('metalsmith-uglify')
const browserify = require('browserify')
const babelify = require('babelify')
const async = require('async')

const bundleScripts = function () {
  return function (files, metalsmith, done) {
    async.eachSeries(Object.keys(files), (file, cb) => {
      let entryPath = path.join(__dirname, '../src', file)
      let bundle = browserify({ entries: [entryPath] })

      bundle.transform(babelify, { presets: ['es2015'] })

      bundle.bundle((err, buf) => {
        if (err) {
          return cb(err)
        }

        files[file].contents = buf
        cb(null, buf)
      })
    }, (err, res) => {
      done(err)
    })
  }
}

Metalsmith(__dirname)
  .source('../src')
  .destination('../www')
  .clean(false)
  .use(ignore([ '**/*', '**/.*', '!js/**/*.js' ]))
  .use(bundleScripts())
  .use(uglify({ nameTemplate: '[name].[ext]' }))
  .use(msIf(
    process.argv.indexOf('--watch') !== -1, watch({
      paths: { '${source}/js/*.js': true }
    })
  ))
  .build((err) => {
    if (err) {
      throw err
    }
  })
