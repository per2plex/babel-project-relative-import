# Babel Project Relative Import

[![build](https://travis-ci.org/per2plex/babel-project-relative-import.svg?branch=master)](https://travis-ci.org/per2plex/babel-project-relative-import)
[![dependencies](https://david-dm.org/per2plex/babel-project-relative-import.svg)](https://david-dm.org/per2plex/babel-project-relative-import)
[![devDependency Status](https://david-dm.org/per2plex/babel-project-relative-import/dev-status.svg)](https://david-dm.org/per2plex/babel-project-relative-import#info=devDependencies)
[![code climate](https://codeclimate.com/github/per2plex/babel-project-relative-import/badges/gpa.svg)](https://codeclimate.com/github/per2plex/babel-project-relative-import)

Babel plugin to transform project relative paths to file relative paths.
Highly inspired by [babel-root-import](https://github.com/michaelzoidl/babel-root-import)
which works great, but converts to absolute paths, so the built files are not
portable accross systems.


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


## Options

TODO