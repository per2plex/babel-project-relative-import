# Babel Project Relative Import

[![build](https://travis-ci.org/per2plex/babel-project-relative-import.svg?branch=master)](https://travis-ci.org/per2plex/babel-project-relative-import)
[![dependencies](https://david-dm.org/per2plex/babel-project-relative-import.svg)](https://david-dm.org/per2plex/babel-project-relative-import)
[![devDependency Status](https://david-dm.org/per2plex/babel-project-relative-import/dev-status.svg)](https://david-dm.org/per2plex/babel-project-relative-import#info=devDependencies)
[![code climate](https://codeclimate.com/github/per2plex/babel-project-relative-import/badges/gpa.svg)](https://codeclimate.com/github/per2plex/babel-project-relative-import)

Babel plugin to transform project relative import paths to file relative import paths.
Highly inspired by [babel-root-import](https://github.com/michaelzoidl/babel-root-import)
which works great, but converts to absolute paths, so the built files are not
portable accross systems.

Tested with [babel-cli](https://www.npmjs.com/package/babel-cli),
[babel-loader](https://www.npmjs.com/package/babel-loader) and
[gulp-babel](https://www.npmjs.com/package/gulp-babel).

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
import Test from '../otherdir/example.js'

// project/dir/subdir/test.js
import Test from '../../otherdir/subdir/example.js'
```

## Install

```
npm install babel-project-root-import
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