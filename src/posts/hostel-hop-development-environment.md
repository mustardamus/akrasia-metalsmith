---
title: Hostel Hop Day 3 - Development Environment
date: 2014-02-20
---

### Hipster coding? Nah, I just like to save myself time

In my job as a web developer I mostly write pure JavaScript, HTML & CSS. For
personal projects however, I rely on those kewl shiny things like CoffeeScript
and Stylus. The biggest pro is that it just saves so much time typing. Thus you
can get more done. And I want to move!

Here is what I want to use to set up the development environment and structure
for Hostel Hop:

  * [CoffeeScript](http://coffeescript.org/) for the scripting
  * [Browserify](http://browserify.org/) for structuring the scripts
  * [Backbone](http://backbonejs.org/) for structuring the app
  * [Stylus](http://learnboost.github.io/stylus/) for the styling and structuring
  * [Foundation](http://foundation.zurb.com/)  or [Semantic UI](http://semantic-ui.com/) for the markup
  * [Font-Awesome](http://fortawesome.github.io/Font-Awesome/) for pretty icons
  * [Bower](http://bower.io/) to manage 3rd party scripts and styles
  * [Gulp.js](http://gulpjs.com/) to put it all together


### Gulp.js to put it all together

Before Gulp.js was released some weeks ago, I was using
[Grunt.js](http://gruntjs.com/) - also a build tool for JavaScript. And I was
happy with it. It did it's thing and translated CoffeeScript, Stylus, etc. It
had a development server and live reload. Everything I needed.
Still, it was a pain in the ass to configure. And that is
how Grunt.js is built - around configuration.

With Gulp.js it's different. It's built around streaming. Which means, you read
some files in, pass the content through some functions, and write the output to
disk. In the best case no configuration is needed, at all.
Let's see how to build the different parts of the app.

#### CoffeeScript & Browserify

In this snippet Browserify compiles the CoffeeScript and create a JavaScript
bundle of the app.

```javascript
var coffee = require('gulp-coffee');
var browserify = require('gulp-browserify');

gulp.task('coffee', function() {
  gulp
    .src('./app/scripts/main.coffee', { read: false })
    .pipe(browserify({
      transform: ['coffeeify'],
      extensions: ['.coffee']
    }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./public/scripts/'));
});
```

#### JavaScript vendors

All JS 3rd party scripts, such as jQuery and Backbone, should be compiled and
minified in one file. There is a Gulp.js plugin for that:
[gulp-include](https://npmjs.org/package/gulp-include/). It provides *require*
statements (like [Sprockets](https://github.com/sstephenson/sprockets)) and
replace it with the actual file content.

The *vendor.js* looks like this:

```javascript
//= require ../bower_components/jquery/dist/jquery.js
//= require ../bower_components/underscore/underscore.js
//= require ../bower_components/backbone/backbone.js
//= require ../bower_components/mustache/mustache.js
//= require ../bower_components/modernizr/modernizr.js
```

And this task compiles and minifies it all:

```javascript
var include = require('gulp-include');
var uglify = require('gulp-uglify');

gulp.task('vendor-js', function() {
  gulp
    .src('./app/scripts/vendor.js')
    .pipe(include())
    .pipe(uglify())
    .pipe(gulp.dest('./public/scripts/'));
});
```

#### Stylus

This snippet compiles Stylus. The stylesheets are organized in seperate files,
just as the javascripts. Stylus has a
[@import](http://learnboost.github.io/stylus/docs/import.html) function to
concat files.

```javascript
var stylus = require('gulp-stylus');

gulp.task('stylus', function() {
  gulp
    .src('./app/styles/main.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./public/styles/'));
});
```

#### Stylehsheet vendors

As with the JavaScript vendors I want all stylesheets, like Normalize and
Foundation, in one file. Minified.

The *vendor.css* looks like this:

```javascript
//= require ../bower_components/foundation/css/normalize.css
//= require ../bower_components/foundation/css/foundation.css
//= require ../bower_components/font-awesome/css/font-awesome.css
```

Note that this is not valid CSS. In Sprockets, you would have instead written:

```css
/*= require '...' */
```

I wrote it the JavaScript way because gulp-include does not officially support
CSS. Anyway, it is exactly working the same as in JS. And at the end, a valid
vendor stylesheet is coming out with this task:

```javascript
var include = require('gulp-include');
var csso = require('gulp-csso');

gulp.task('vendor-css', function() {
  gulp
    .src('./app/styles/vendor.css')
    .pipe(include())
    .pipe(csso())
    .pipe(gulp.dest('./public/styles/'));
});
```

#### Copy the HTML files and fonts

These assets do not need any processing, so we just copy them to the destination
path.

```javascript
gulp.task('copy-html', function() {
  gulp
    .src('./app/*.html')
    .pipe(gulp.dest('./public/'));
});

gulp.task('copy-fonts', function() {
  gulp
    .src('./app/bower_components/font-awesome/fonts/*')
    .pipe(gulp.dest('./public/fonts/'));
});
```

#### The complete build task

Putting everything above together, and we can build the application to its
destination folder:

```javascript
gulp.task('build',
  ['copy-html', 'stylus', 'coffee', 'vendor-js', 'vendor-css', 'copy-fonts']
);
```

#### Watching for changes

Now, I don't want to run the *build* task over and over again, whenever I change
files. Luckily Gulp.js has a *watch* function built in:

```javascript
gulp.task('watch', function() {
  gulp.watch('./app/*.html', ['copy-html']);
  gulp.watch('./app/styles/**/*.styl', ['stylus']);
  gulp.watch('./app/styles/vendor.css', ['vendor-css']);
  gulp.watch('./app/scripts/**/*.coffee', ['coffee']);
  gulp.watch('./app/scripts/vendor.js', ['vendor-js']);
});
```

#### Serving the build

The development environment is almost complete. At last we need a webserver so
we can develop on *localhost*.
[gulp-connect](https://www.npmjs.org/package/gulp-connect/) does exatcly that:

```javascript
var connect = require('gulp-connect');

gulp.task('server', ['build', 'watch'], connect.server({
  root: ['public'],
  port: 9000,
  livereload: {
    port: 31629
  }
}));
```

Notice that gulp-connect has
[livereload](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
built right in. We only have to make it aware that a change has happened and
that the browser should reload (example on the *copy-html* task):

```javascript
gulp.task('copy-html', function() {
  gulp
    .src('./app/*.html')
    .pipe(gulp.dest('./public/'))
    .pipe(connect.reload());
});
```

### (Gulp) Conclusion

Just like that we have a pretty sweet development environment with all the shiny
things a web developer from the future would want. At least, I want them.

I only can express my admiration for Gulp.js. Such a sweet and simple tool to
put together all the various things. And probably more in the future (read
tests). I officially welcome you to my tool-belt.

### The complete gulpfile.js

```javascript
var gulp       = require('gulp');
var stylus     = require('gulp-stylus');
var connect    = require('gulp-connect');
var coffee     = require('gulp-coffee');
var browserify = require('gulp-browserify');
var concat     = require('gulp-concat');
var include    = require('gulp-include');
var uglify     = require('gulp-uglify');
var csso       = require('gulp-csso');

gulp.task('stylus', function() {
  gulp
    .src('./app/styles/main.styl')
    .pipe(stylus())
    .pipe(gulp.dest('./public/styles/'))
    .pipe(connect.reload());
});

gulp.task('vendor-css', function() {
  gulp
    .src('./app/styles/vendor.css')
    .pipe(include())
    .pipe(csso())
    .pipe(gulp.dest('./public/styles/'))
    .pipe(connect.reload());
});

gulp.task('coffee', function() {
  gulp
    .src('./app/scripts/main.coffee', { read: false })
    .pipe(browserify({
      transform: ['coffeeify'],
      extensions: ['.coffee']
    }))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./public/scripts/'))
    .pipe(connect.reload());
});

gulp.task('vendor-js', function() {
  gulp
    .src('./app/scripts/vendor.js')
    .pipe(include())
    .pipe(uglify())
    .pipe(gulp.dest('./public/scripts/'))
    .pipe(connect.reload());
});

gulp.task('copy-html', function() {
  gulp
    .src('./app/*.html')
    .pipe(gulp.dest('./public/'))
    .pipe(connect.reload());
});

gulp.task('copy-fonts', function() {
  gulp
    .src('./app/bower_components/font-awesome/fonts/*')
    .pipe(gulp.dest('./public/fonts/'))
});

gulp.task('build',
  ['copy-html', 'stylus', 'coffee', 'vendor-js', 'vendor-css', 'copy-fonts']
);

gulp.task('watch', function() {
  gulp.watch('./app/*.html', ['copy-html']);
  gulp.watch('./app/styles/**/*.styl', ['stylus']);
  gulp.watch('./app/styles/vendor.css', ['vendor-css']);
  gulp.watch('./app/scripts/**/*.coffee', ['coffee']);
  gulp.watch('./app/scripts/vendor.js', ['vendor-js']);
});

gulp.task('server', ['build', 'watch'], connect.server({
  root: ['public'],
  port: 9000,
  livereload: {
    port: 31629
  }
}));

gulp.task('default', ['server']);
```
