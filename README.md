# [Akrasia.me](http://akrasia.me)

This is my digital shelter, respective a Blog, Portfolio and Gallery. It is a
static site and powered by [Metalsmith](http://www.metalsmith.io/), which of I
became a huge fan. It's like Lego and duct tape.

## *tl;dr*

* Tasks are executed with [Yarn](https://yarnpkg.com/), so you need it installed
  globally: `npm install yarn -g`
* Initally install all dependencies: `yarn`
* Build the static production site in `./www`: `yarn run build`
* Start the server and watch files for changes, rebuild: `yarn start`

## Tasks

Each task has its own file, which is a Metalsmith build script, found in
`./lib`. Each task can be run individually but also easily all together.

### Site Assets

#### `yarn run build:scripts` & `yarn run watch:scripts` 

#### `yarn run build:styles` & `yarn run watch:styles` 

#### `yarn run build:assets` & `yarn run watch:assets`

### Pages

#### `yarn run build:pages` & `yarn run watch:pages`

### Posts

#### `yarn run build:posts` & `yarn run watch:posts`

### Pictures

#### `yarn run build:pictures` & `yarn run watch:pictures`

### General

#### `yarn run clean`

#### `yarn run build`

#### `yarn run watch`

#### `yarn run serve`

#### `yarn run start`
