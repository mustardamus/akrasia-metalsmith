'use strict'

const Metalsmith = require('metalsmith')
const ignore = require('metalsmith-ignore')
const permalinks = require('metalsmith-permalinks')
const collections = require('metalsmith-collections')
const layouts = require('metalsmith-layouts')
const moveRemove = require('metalsmith-move-remove')
const lwip = require('lwip')
const async = require('async')

const tagPictures = function () {
  return function (files, metalsmith, done) {
    setImmediate(done)

    Object.keys(files).forEach((file) => {
      files[file].fullpath = file
      files[file].thumbpath = file.replace('.JPG', '_thumb.JPG')
      files[file].country = file.split('/')[1]
      files[file].city = file.split('/')[2]
    })
  }
}

const resize = function (buf, width, cb) {
  lwip.open(buf, 'jpg', (err, image) => {
    if (err) {
      return cb(err)
    }

    let height = image.height() * width / image.width() + 1

    image
      .batch()
      .resize(width, height, 'grid')
      .toBuffer('jpg', (err, buf) => {
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

      resize(files[file].contents, 1000, (err, buf) => {
        files[file].contents = buf

        resize(buf, 300, (err, buf) => {
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
  .source('./src')
  .destination('./www')
  .clean(false)
  .use(ignore([
    '**/*', '**/.*',
    '!pictures/**/*.JPG',
    '!layouts/pictures.html'
  ]))
  .use(tagPictures())
  .use(permalinks())
  .use(collections({ pictures: 'pictures/**/*' }))
  .use(layouts({
    engine: 'handlebars',
    directory: 'src/layouts',
    partials: 'src/partials',
    default: 'pictures.html'
  }))
  //.use(resizePictures())
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
