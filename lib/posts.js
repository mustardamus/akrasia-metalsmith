'use strict'

const Metalsmith = require('metalsmith')
const ignore = require('metalsmith-ignore')
const msIf = require('metalsmith-if')
const watch = require('metalsmith-watch')
const collections = require('metalsmith-collections')
const metallic = require('metalsmith-metallic')
const markdown = require('metalsmith-markdown')
const permalinks = require('metalsmith-permalinks')
const excerpts = require('metalsmith-excerpts')
const feedAtom = require('metalsmith-feed-atom')
const layouts = require('metalsmith-layouts')
const moveRemove = require('metalsmith-move-remove')

Metalsmith(__dirname)
  .source('./src')
  .destination('./www')
  .clean(false)
  .use(ignore([ '**/*', '!posts/**/*.md', '!layouts/posts.html' ]))
  .use(collections({ posts: {
    pattern: 'posts/**/*',
    sortBy: 'date',
    reverse: true
  }}))
  .use(metallic())
  .use(markdown())
  .use(permalinks())
  .use(excerpts())
  .use(feedAtom({
    collection: 'posts',
    destination: 'feed.xml',
    metadata: {
      title: 'Akrasia',
      subtitle: 'Blog, Portfolio and Digital Playground of Sebastian Senf (@mustardamus)',
      url: 'http://akrasia.me'
    }
  }))
  .use(layouts({
    engine: 'handlebars',
    directory: 'src/layouts',
    partials: 'src/partials',
    default: 'post.html',
    pattern: 'posts/**/*'
  }))
  .use((files) => {
    files['posts/index.html'] = { contents: new Buffer('') }
  })
  .use(layouts({
    engine: 'handlebars',
    directory: 'src/layouts',
    partials: 'src/partials',
    default: 'posts.html',
    pattern: 'posts/index.html'
  }))
  .use(moveRemove({ remove: ['layouts'] }))
  .use(msIf(
    process.argv.indexOf('--watch') !== -1, watch({
      paths: {
        '${source}/posts/*.md': true,
        '${source}/layouts/index.html': '*.html',
        '${source}/layouts/posts.html': '*.html',
        '${source}/layouts/post.html': '*.html'
      }
    })
  ))
  .build((err) => {
    if (err) {
      throw err
    }
  })
