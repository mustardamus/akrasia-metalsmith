---
title: Ekso - Node.js Module to require entire directory structures
date: 2016-06-05
---

## The quest of structure

I am on a quest of structuring the Node.js backend part of my projects for quite
some time. While I enjoy using frameworks like
[Express.js](http://expressjs.com/) and [Hapi.js](http://hapijs.com/), they are
not solving the problem of how to structure directories, files and in-code
hierachy and dependencies.

But that's okay, good even. I enjoy structuring projects. It's something many
many coders have done already, and even with the DRY mantra in mind, I can't
help myself to do it over and over, better and different every time. It's fun.

When I created the
[Grail Yeoman Generator](https://github.com/mustardamus/generator-grail), I used
a little script for the initilization of the Node.js server, powered by
Express.js.

```coffeescript
fs      = require('fs')
http    = require('http')
express = require('express')
socket  = require('socket.io')
config  = require('./config')

initDir = (path) ->
  outObj = {}

  for fileName in fs.readdirSync(path)
    funcs = require("#{path}/#{fileName}")
    name  = fileName.split('.')[0]

    if funcs and name
      outObj[name] = funcs
      pathArr      = path.split('/')
      console.log "-> #{pathArr[pathArr.length - 1]}/#{fileName}"

  outObj

app       = express()
server    = http.Server(app)
io        = socket(server)
helpers   = initDir(config.server.helpersDir)
routes    = initDir(config.server.routesDir)
inits     = initDir(config.server.initializeDir)
models    = {}
modelsDir = config.server.modelsDir

if fs.existsSync(modelsDir) and fs.readdirSync(modelsDir).length
  mongoose = require('mongoose')
  models   = initDir(modelsDir)
  db       = mongoose.connection

  for resourceName, modelFunc of models
    models[resourceName] = modelFunc.call(mongoose, helpers)

  db.once 'open', ->
    console.log "Connected to database #{config.database.url}..."

  db.on 'error', ->
    console.log "Can not connect to database #{config.database.url}! 'mongod' running?"

  mongoose.connect config.database.url

for initName, initFunc of inits
  initFunc.call(app, config, helpers, io, models)

for resourceName, routesFunc of routes
  routesFunc.call(app, config, helpers, io, models)

server.listen config.server.port, ->
  console.log "\nWebserver started on port #{config.server.port}..."
```

As you can see, the Helpers, Models and Routes are initilized by the directory
stucture, rather than requiring them all seperately.

Even this was a quick and dirty script, it worked nicely for my needs. I just
would create a new Model for example, restart the server and it would be
available to me. However, I was already planning on how I could improve the
requiring and initilization.

## Dedicated Node.js Module - Ekso

When I was in a bus to Milano I finally started a dedicated module, solely for
the purpose of requiring entire directory structures as well as initilizing
functions and such.

I had a two month trip in Italy and Spain, with six bus rides in between. That's
when I developed Ekso. I finished it at the end of the trip, which was about two
months ago, but I only got myself to finish the documentation (the fucking last
10%) just today.

Anyhow, I am happy with the result. I'm still working on a live project that is
using Ekso, but for demonstration purposes I have created a simple
[MVC example](https://github.com/mustardamus/ekso/tree/master/examples/mvc):

```javascript
'use strict'

const ekso = require('../../lib')

const App = ekso({
  rootDir: __dirname,                 // set root directory to this scripts directory
  pathTransforms: ['capitalize'],     // capitalize all paths
  globalRequire: {                    // globally require the following modules
    _: 'lodash'                       // lodash as _
  }
}, [
  {
    path: 'config',                   // require whole config directory
    global: true                      // make it global - Config
  },
  {
    path: 'helpers',                  // require whole helpers directory
    global: true                      // make it global - Helpers
  },
  {
    path: 'views',                    // require whole views directory
    global: true                      // make it global - Views
  },
  {
    path: 'models',                   // require whole models directory
    nameTransforms: ['camelCase', 'capitalize'], // transform the name - ie User
    globalLast: true,                 // make last part of the path global - ie User
    executeFuncs: true,               // execute exported functions
    funcContext: 'Model Context',     // with 'this' when calling the function
    funcArgs: ['Model db Variable']   // pass arguments to the function when calling
  },
  {
    path: 'controllers',              // require whole controllers directory
    nameTransforms: ['camelCase', 'capitalize'], // transform the name - ie Users
    namePostfix: 'Controller'         // append string to name - ie UsersController
  }
])

App.Controllers.UsersController.index()
console.log('==========')
console.log(App)

/*
User Model Initialized
db: Model db Variable
this: [String: 'Model Context']
db url config: some db url
Users Controller Index Function
Invoke Helper: Ekso example
User Model: User Model Schema
User Index View: Users Index Template: User Model Schema
==========
{ Config:
    { app: { name: 'ekso example' },
      database: { url: 'some db url' } },
  Helpers: { capitalize: [Function] },
  Views: { Users: { index: [Function], read: [Function] } },
  Models: { User: 'User Model Schema' },
  Controllers: { UsersController: { index: [Function], create: [Function] } } }
*/
```

Much cleaner than the hacky initilization script from before. And more features,
also.

I released Ekso to the NPM registry, so a simple `npm install ekso` will
get you started if you'd like to try it out.

## [Ekso GitHub Repository](https://github.com/mustardamus/ekso)
