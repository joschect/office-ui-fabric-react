'use strict';

let build = require('@microsoft/web-library-build');
let serial = build.serial;
let parallel = build.parallel;
let buildConfig = build.getConfig();
let gulp = require('gulp');
let configFile = "./ftpconfig.json";
let fs = require('fs');
let path = require('path');
let del = require('del');
let gulpConnect = require('gulp-connect');

let isProduction = process.argv.indexOf('--production') >= 0;
let isNuke = process.argv.indexOf('nuke') >= 0;
let packageFolder = buildConfig.packageFolder || '';
let distFolder = buildConfig.distFolder;

let visualTestClean = build.subTask('visualTestClean', (gulp, options, done) => {
  return del(['failures/*png', 'results/*png']).then(() => done());
});

let visualTest = build.subTask('visualtest', (gulp, options, done) => {
  gulpConnect.server({
    livereload: false,
    directoryListing: false
  });
  if (!options.args['debug']) {
    let casperJs = require('gulp-phantomcss');
    gulp.src(['lib/**/*.visualtest.js'])
      .pipe(casperJs(
        {
          screenshots: 'screenshots',
          comparisonResultRoot: 'results'
        })).on('end', done);
  }
});

// Configure custom lint overrides.
build.tslint.setConfig({ lintConfig: require('./tslint.json') });

// Configure TypeScript 2.0.
build.typescript.setConfig({ typescript: require('typescript') });

// Use css modules.
build.sass.setConfig({ useCSSModules: true });

// Disable unnecessary subtasks.
build.preCopy.isEnabled = () => false;
build.postCopy.isEnabled = () => isProduction;

// Until typings work.
//build.apiExtractor.isEnabled = () => false;

// Copy fabric-core to dist to be published with fabric-react.
build.postCopy.setConfig({
  copyTo: {
    [path.join(distFolder, 'sass')]: [
      'node_modules/office-ui-fabric-core/dist/sass/*.*'
    ],
    [path.join(distFolder, 'css')]: [
      'node_modules/office-ui-fabric-core/dist/css/*.*'
    ]
  }
});

// process *.Props.tsx as text.
build.text.setConfig({ textMatch: ['src/**/*.Props.ts'] });

// Produce AMD bits in lib-amd on production builds.
if (isProduction || isNuke) {
  build.setConfig({
    libAMDFolder: path.join(packageFolder, 'lib-amd')
  });
}

// Disable certain subtasks in non production builds to speed up serve.
build.tslint.isEnabled = () => isProduction;
build.webpack.isEnabled = () => isProduction;
build.clean.isEnabled = () => isProduction;

// Short aliases for subtasks.
build.task('webpack', build.webpack);
build.task('tslint', build.tslint);
build.task('ts', build.typescript);

build.task('visualtest', serial(build.typescript, build.webpack, visualTestClean, visualTest));

// initialize tasks.
build.initialize(gulp);
