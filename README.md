# Babel Project Relative Import

[![npm][npm-badge]][npm-url]
[![build][travis-badge]][travis-url]
[![windows build][appveyor-badge]][appveyor-url]
[![dependencies][david-badge]][david-url]
[![devDependencies][david-dev-badge]][david-dev-url]
[![coverage][coverage-badge]][coverage-url]

Babel plugin to transform project relative import paths to file relative import paths.
Highly inspired by [babel-root-import](https://github.com/michaelzoidl/babel-root-import)
which works great, but converts to absolute paths, so the built files are not
portable accross systems.

Tested with [babel-cli](https://www.npmjs.com/package/babel-cli),
[babel-loader](https://www.npmjs.com/package/babel-loader),
[grunt-babel](https://www.npmjs.com/package/grunt-babel) and
[gulp-babel](https://www.npmjs.com/package/gulp-babel).
Does also transform to the same path under Windows.

## Example

```javascript
// project/dir/test.js
import Test from '~/otherdir/example.js'

// project/dir/subdir/test.js
import Test from '~/otherdir/subdir/example.js'
```
Will be transformed to:
```javascript
// project/dir/test.js
import Test from './../otherdir/example.js'

// project/dir/subdir/test.js
import Test from './../../otherdir/subdir/example.js'
```

## Install

```
npm install babel-project-relative-import
```

## Usage

Add babel-project-root-import to your plugins in your `babel.rc`:

```json
{
  "plugins": [
    "babel-project-relative-import"
  ]
}
```

## Plugin Options

### projectPathSuffix

If all your source files are inside a subdirectory set this option to the path
of the subdirectory so paths get resolved correctly.

```json
{
  "plugins": [
    ["babel-project-relative-import", {
      "projectPathSuffix": "src/"
    }]
  ]
}
```

### importPathPrefix

If you want to have a custom prefix which will be used to detect imports, you
can set this option, defaults to `~`.

```json
{
  "plugins": [
    ["babel-project-relative-import", {
      "importPathPrefix": "^"
    }]
  ]
}
```

[npm-url]: https://www.npmjs.com/package/babel-project-relative-import
[npm-badge]: https://img.shields.io/npm/v/babel-project-relative-import.svg

[travis-url]: https://travis-ci.org/per2plex/babel-project-relative-import
[travis-badge]: https://img.shields.io/travis/per2plex/babel-project-relative-import/master.svg

[appveyor-url]: https://ci.appveyor.com/project/per2plex/babel-project-relative-import
[appveyor-badge]: https://img.shields.io/appveyor/ci/per2plex/babel-project-relative-import.svg?label=windows%20build

[david-dev-url]: https://david-dm.org/per2plex/babel-project-relative-import
[david-dev-badge]: https://img.shields.io/david/dev/per2plex/babel-project-relative-import.svg

[david-url]: https://david-dm.org/per2plex/babel-project-relative-import
[david-badge]: https://img.shields.io/david/per2plex/babel-project-relative-import.svg

[coverage-url]: https://coveralls.io/github/per2plex/babel-project-relative-import
[coverage-badge]: https://img.shields.io/coveralls/per2plex/babel-project-relative-import/master.svg
