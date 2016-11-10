'use strict'

const Metalsmith = require('metalsmith')
const ignore = require('metalsmith-ignore')
const permalinks = require('metalsmith-permalinks')
const collections = require('metalsmith-collections')
const layouts = require('metalsmith-layouts')
const moveRemove = require('metalsmith-move-remove')
const lwip = require('lwip')
const async = require('async')

const imageWidth = 1024
const imageQuality = 95
const thumbWidth = 300
const thumbQuality = 78
const interMethod = 'moving-average' // https://github.com/EyalAr/lwip#resize

const tagPictures = function () {
  return function (files, metalsmith, done) {
    for (let file in files) {
      if (file.indexOf('.JPG') !== -1) {
        files[file].fullpath = file
        files[file].thumbpath = file.replace('.JPG', '_thumb.JPG')
        files[file].country = file.split('/')[1]
        files[file].city = file.split('/')[2]
      }
    }

    done()
  }
}

const generateMetadata = function () {
  return function (files, metalsmith, done) {
    let countries = []
    let cities = []

    for (let file in files) {
      let country = files[file].country
      let city = files[file].city

      if (country && countries.indexOf(country) === -1) {
        countries.push(country)
      }

      if (city && cities.indexOf(city) === -1) {
        cities.push(city)
      }
    }

    metalsmith.metadata().countries = countries.sort()
    metalsmith.metadata().cities = cities.sort()

    done()
  }
}

const resize = function (buf, width, quality, cb) {
  lwip.open(buf, 'jpg', (err, image) => {
    if (err) {
      return cb(err)
    }

    let height = image.height() * width / image.width() + 1

    image
      .batch()
      .resize(width, height, interMethod)
      .toBuffer('jpg', { quality }, (err, buf) => {
        cb(err, buf)
      })
  })
}

const resizePictures = function () {
  return function (files, metalsmith, done) {
    async.eachSeries(Object.keys(files), (file, cb) => {
      if (file.indexOf('.JPG') === -1) {
        return cb()
      }

      resize(files[file].contents, imageWidth, imageQuality, (err, buf) => {
        if (err) {
          return cb(err)
        }

        files[file].contents = buf

        resize(buf, thumbWidth, thumbQuality, (err, buf) => {
          let thumbName = file.replace('.JPG', '_thumb.JPG')
          files[thumbName] = { contents: buf }

          console.log(file)
          cb(err)
        })
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
  .metadata(require('../metadata.json'))
  .use(ignore([
    '**/*', '**/.*',
    '!pictures/**/*.JPG',
    '!layouts/pictures.html'
  ]))
  .use(tagPictures())
  .use(generateMetadata())
  .use(permalinks())
  .use(collections({ pictures: 'pictures/**/*' }))
  .use(layouts({
    engine: 'handlebars',
    directory: '../src/layouts',
    partials: '../src/partials',
    default: 'pictures.html'
  }))
  .use(resizePictures())
  .use(moveRemove({
    move: [{
      source: 'layouts/pictures/index.html',
      target: 'pictures/index.html'
    }],
    remove: ['layouts']
  }))
  .build((err) => {
    if (err) {
      throw err
    }
  })
