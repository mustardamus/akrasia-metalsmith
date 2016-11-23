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
[`./lib`](./lib). Each task can be run individually but also easily all
together.

### [Assets](./lib/assets.js)

#### `yarn run build:assets` & `yarn run watch:assets`

This will copy the `./src/assets` folder to `./www/assets`. Put all static
resources in here.

#### `yarn run build:scripts` & `yarn run watch:scripts`

This will bundle each `*.js` file in `./src/js` with
[Browserify](http://browserify.org/) and transpile them with
[Babel](https://babeljs.io/), so you can write neat ES2015. Note that really
each file in this folder will be a separate bundle - that is useful to leave
out unnecesary code for different pages.  

#### `yarn run build:styles` & `yarn run watch:styles` 

This will bundle the stylesheet with [Stylus](http://stylus-lang.com/). Note
that unlike scripts, there is only one entry point you can find at
`./src/css/index.styl`. There you can `import` other stylus files or ordinary
CSS files. Auto-prefixing is enabled, so you don't have to care about it.

### [Pages](./lib/pages.js)

You can find the pages in `./src/pages` as `*.html` partials. They will be
wrapped with the `./src/layouts/page.html` layout.

Each page must have a YAML front-matter with the following informations:

      ---
      title: The page <title>
      pagename: The page name (to be processed in header.html and footer.html partials)
      banner: The banner text above the actual page content
      ---

Note that `./src/pages/index.html` is the home page, aka the `/` root route.

#### `yarn run build:pages` & `yarn run watch:pages`

This will build all static pages. Instead of putting them in the subfolder
`pages` like in `./src`, they will be copied one folder up. Also permalinks will
be created, for example:

    ./src/pages/skills.html -> ./www/skills/index.html
    ./src/pages/index.html -> ./www/index.html

That way we can have neat URL's. Additionally the HTML will be minified.


### [Posts](./lib/posts.js)

All posts are located in `./src/posts` and are written in
[Markdown](https://daringfireball.net/projects/markdown/syntax). They will be
wrapped with the `./src/layouts/post.html` layout.

Each post must have a YAML front-matter with the following informations:

    ---
    title: Title of the post (will be displayed as banner above the content)
    date: YYYY-MM-DD (the date when the post was published)
    ---

The index of all posts is created from the `./src/layouts/posts.html` layout.

#### `yarn run build:posts` & `yarn run watch:posts`

Builds all post. Permalinks will be created, for example:

    ./src/posts/post-title.md -> ./www/posts/post-title/index.html
    ./src/layouts/posts.html -> ./www/posts/index.html

That way we can have neat URL's. Additionally the HTML will be minified.

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

          ```javascript
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
          ```

4. Include metadata from `./metadata.json` and make it available to the
   template.
  
5. Compiles the `./src/layouts/pictures.html` template with
   [EJS](http://ejs.co/).

6. Moves the result from `./www/layouts/pictures.html` to
   `./www/pictures/index.html` and removes the empty `./www/layouts` folder.

7. Minifies the result HTML with
   [html-minifier](https://github.com/kangax/html-minifier).

Note that there are no `watch` task for pictures since it is really time
consuming to resize them all.

### [General](./package.json)

#### `yarn run clean`

Removes `./www` completely.

#### `yarn run build`

Runs `yarn run clean` and then runs all `build` scripts in series. To get a
completely ready  production site, run this command.

#### `yarn run watch`

Runs all `watch` scripts in parallel.

#### `yarn run serve`

Starts a HTTP server on port `9999` with [BrowserSync](https://browsersync.io).
`*.html`, `*.css` and `*.js` in `./www` are watched for changes and the page
will be reloaded automatically.

#### `yarn start`

Runs `yarn run watch` and `yarn run serve`. If you want to develop the site, run
this command.


## Used Resources

- [Entypo Icons](http://www.entypo.com/)
- [Lato Font](https://fonts.google.com/specimen/Lato)
- [Lancelot Font](https://fonts.google.com/specimen/Lancelot)
- [Inconsolata Font](https://fonts.google.com/specimen/Inconsolata)
