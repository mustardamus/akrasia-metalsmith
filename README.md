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

### Assets

#### `yarn run build:scripts` & `yarn run watch:scripts` 

#### `yarn run build:styles` & `yarn run watch:styles` 

#### `yarn run build:assets` & `yarn run watch:assets`

### Pages

#### `yarn run build:pages` & `yarn run watch:pages`

### Posts

#### `yarn run build:posts` & `yarn run watch:posts`

### [Pictures](./lib/pictures.js)

These are some of my pictures I took while traveling. Therefor the folder
structure is organized in countries and cities:

    - ./src/pictures
      - country
        - city
          - picture.jpg
          - picture.jpg
        - city
          - picture.jpg
        - ...
      - ...

Note that currently all pictures have the same format, dimensions and file name
formats - because I took them all with the same camera. If you add pictures that
are different in any aspect, you need to edit the build script. Just sayin'.

#### `yarn run build:pictures`

1. Takes all pictures in `./src/pictures` and resizes them with 
   [lwip](https://github.com/EyalAr/lwip). Folder- and file-names will be 1:1.

2. Creates a thumbnail of each picture and saves it under `*_thumb.JPG` in the
   same folder as the picture.

3. Generates metadata that can be used in the `./src/layouts/pictures.html`
   template:

   * `countries`: Array of Strings of all country names
   * `cities`: Array of Strings of all city names
   * `citiesObj`: Object of Objects with country name and pictures for each city

          citiesObj: {
            cityName: {
              country: 'country name',
              pictures: [
                {
                  fullpath: 'path of full size picture',
                  thumbpath: 'path of thumbnail',
                  country: 'country name',
                  city: 'city name'
                },
                ...
              ]
            },
            ...
          }

4. Include metadata from `./metadata.json` and make it available to the
   template.
  
5. Compiles the `./src/layouts/pictures.html` template with
   [EJS](http://ejs.co/).

6. Copies the result from `./www/layouts/pictures.html` to
   `./www/pictures/index.html`.

7. Minifies the result HTML with
   [html-minifier](https://github.com/kangax/html-minifier).

### General

#### `yarn run clean`

#### `yarn run build`

#### `yarn run watch`

#### `yarn run serve`

#### `yarn run start`
