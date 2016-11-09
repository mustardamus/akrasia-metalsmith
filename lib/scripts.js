'use strict'

const fs = require('fs')
const path = require('path')
const Metalsmith = require('metalsmith')
const ignore = require('metalsmith-ignore')
const msIf = require('metalsmith-if')
const watch = require('metalsmith-watch')
const browserify = require('metalsmith-browserify')
const babelify = require('babelify')
const uglify = require('metalsmith-uglify')

let jsSrcDir = path.join(__dirname, 'src/js')
let jsDistDir = path.join(__dirname, 'www/js')
let metalsmith = Metalsmith(__dirname)
  .source('./src')
  .destination('./www')
  .clean(false)
  .use(ignore([ '**/*', '!js/**/*.js' ]))

for (let file of fs.readdirSync(jsSrcDir)) {
  let bundle = browserify(`${jsDistDir}/${file}`, [`${jsSrcDir}/${file}`])

  bundle.bundle.transform(babelify, { presets: ['es2015'] })
  metalsmith.use(bundle)
}

metalsmith
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
