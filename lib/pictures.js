'use strict'

const Metalsmith = require('metalsmith')
const ignore = require('metalsmith-ignore')
const permalinks = require('metalsmith-permalinks')
const layouts = require('metalsmith-layouts')
const minify = require('metalsmith-html-minifier')
const moveRemove = require('metalsmith-move-remove')
const path = require('path')
const fs = require('fs')
const lwip = require('lwip')
const async = require('async')
const metadata = require('../metadata.json')

metadata.pagename = 'pictures'
const imageWidth = 1024
const imageQuality = 95
const thumbWidth = 262
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
    let citiesObj = {}
    let pictureCount = 0
    let metadata = metalsmith.metadata()

    for (let file in files) {
      if (file.indexOf('.JPG') !== -1) {
        let country = files[file].country
        let city = files[file].city

        if (country && countries.indexOf(country) === -1) {
          countries.push(country)
        }

        if (typeof citiesObj[city] === 'undefined') {
          citiesObj[city] = { country, pictures: [files[file]] }
          cities.push(city)
        } else {
          citiesObj[city].pictures.push(files[file])
        }

        pictureCount++
      }
    }

    metadata.countries = countries.sort()
    metadata.cities = cities.sort()
    metadata.citiesObj = citiesObj
    metadata.pictureCount = pictureCount

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
      .toBuffer('jpg', { quality }, cb)
  })
}

const resizePictures = function () {
  return function (files, metalsmith, done) {
    async.eachSeries(Object.keys(files), (file, cb) => {
      let filePath = path.join(__dirname, '../www', file)

      if (file.indexOf('.JPG') === -1 || fs.existsSync(filePath)) {
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
  .metadata(metadata)
  .use(ignore([
    '**/*', '**/.*',
    '!pictures/**/*.JPG',
    '!layouts/pictures.html'
  ]))
  .use(tagPictures())
  .use(generateMetadata())
  .use(permalinks())
  .use(layouts({
    engine: 'ejs',
    directory: '../src/layouts',
    default: 'pictures.html'
  }))
  .use(minify({ removeAttributeQuotes: false }))
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
