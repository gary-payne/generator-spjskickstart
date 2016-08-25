'use strict';

import gulp from "gulp";
import babelify from 'babelify';
import browserify from 'browserify';
import debug from "gulp-debug";
import eslint from "gulp-eslint";
import fs from 'fs';
import print from "gulp-print";
import source from 'vinyl-source-stream';
import sourcemaps from'gulp-sourcemaps';
import spsave from 'gulp-spsave';

import Config  from'./gulpfile.config';
var config = new Config();

//Storing some sensitive config settings in a separate JSON file external to this GIT repo
const settings = JSON.parse(fs.readFileSync("../settings.json"));
//const settings = JSON.parse(fs.readFileSync("../settings-ry.json"));

gulp.task("test", () => {
    console.log("Yes");
});

gulp.task('libs', function(){
    return gulp.src([
            'node_modules/es6-promise/dist/es6-promise.js',
            'node_modules/moment/min/moment.min.js',
            'node_modules/office-ui-fabric/dist/css/fabric.css',
            'node_modules/office-ui-fabric/dist/css/fabric.components.css',
            'node_modules/sp-pnp-js/dist/pnp.min.js',
            'node_modules/whatwg-fetch/fetch.js'])
        .pipe(print())
        .pipe(gulp.dest(config.librariesOutputPath));
});

gulp.task('lint', function() {
    return gulp.src('src/**/*.js')
                .pipe(eslint())
                .pipe(eslint.format())
                .pipe(eslint.failAfterError());
});

gulp.task('js', ['lint'], function() {
    return browserify({
            entries: config.rootJS,
            debug: true
        })
        .transform(babelify, {presets: ['es2015']})
        .on('error', console.error.bind(console))
        .bundle() // Put it all in one file
        .on('error', console.error.bind(console))
        .pipe(source(config.bundleFile)) // Define the name of the bundle
        .pipe(gulp.dest(config.distOutputPath)); // Destination for the bundle
});

//NOTE - the username and password must be XML encoded, otherwise the spsave() call will fail with "invalid STS request"
gulp.task('spupload', ['js'], function () {
    return gulp.src([
            config.distOutputPath + '/*.js',
            config.librariesOutputPath + '/*.css',
            config.librariesOutputPath + '/*.js',
            config.htmlOutputPath + '/*.html'
            ])
        .pipe(spsave({
            username: settings.username,
            password: settings.password,
            siteUrl: settings.siteUrl,
            folder: "<%= libraryName%>",
            notification: true
        }));
})

gulp.task('default', ['spupload']);