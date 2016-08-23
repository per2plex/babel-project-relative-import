import { transform } from 'babel-core'
import { describe, it } from 'mocha'
import { expect } from 'chai'

import rootImportPlugin from '../src/plugin'

describe('Plugin', () => {
  describe('should ignore code', () => {
    it('without filename set', () => {
      const transformedCode = transform(
        'import Test from "~/dir/test"', {
          sourceRoot: '/project/root/',
          plugins: [ rootImportPlugin ]
        }
      )

      expect(transformedCode.code).to.contain('\"~/dir/test\"')
    })

    it('without filename set (require)', () => {
      const transformedCode = transform(
        'const Test = require("~/dir/test")', {
          sourceRoot: '/project/root/',
          plugins: [ rootImportPlugin ]
        }
      )

      expect(transformedCode.code).to.contain('\"~/dir/test\"')
    })

    it('when import path is not prefixed', () => {
      const transformedCode = transform(
        'import Test from "~/dir/test"', {
          filename: 'otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ [ rootImportPlugin, { importPathPrefix: '^' } ] ]
        }
      )

      expect(transformedCode.code).to.contain('\"~/dir/test\"')
    })

    it('when require path does not start with string/template', () => {
      const transformedCode = transform(
        'const Test = require(myVar + "/foo")', {
          filename: '/project/root/otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ rootImportPlugin ]
        }
      )

      expect(transformedCode.code).to.contain('myVar + \"/foo\"')
    })
  })

  describe('should transform the project relative path to a file relative path', () => {
    it('with a custom sourceDir', () => {
      const transformedCode = transform(
        'import Test from "~/dir/test"', {
          filename: 'bla/otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ [ rootImportPlugin, { sourceDir: 'bla/' } ] ]
        }
      )

      expect(transformedCode.code).to.contain('\"./../dir/test\"')
    })

    it('with a custom importPathPrefix', () => {
      const transformedCode = transform(
        'import Test from "^dir/test"', {
          filename: 'otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ [ rootImportPlugin, { importPathPrefix: '^' } ] ]
        }
      )

      expect(transformedCode.code).to.contain('\"./../dir/test\"')
    })

    it('with a relative filename set', () => {
      const transformedCode = transform(
        'import Test from "~/dir/test"', {
          filename: 'otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ rootImportPlugin ]
        }
      )

      expect(transformedCode.code).to.contain('\"./../dir/test\"')
    })

    it('with an absolute filename set', () => {
      const transformedCode = transform(
        'import Test from "~/dir/test"', {
          filename: '/project/root/otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ rootImportPlugin ]
        }
      )

      expect(transformedCode.code).to.contain('\"./../dir/test\"')
    })

    it('without a sourceRoot set', () => {
      const transformedCode = transform(
        'import Test from "~/dir/test"', {
          filename: 'otherdir/test.js',
          plugins: [ rootImportPlugin ]
        }
      )

      expect(transformedCode.code).to.contain('\"./../dir/test\"')
    })

    it('for string require', () => {
      const transformedCode = transform(
        'const Test = require("~/dir/test")', {
          filename: '/project/root/otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ rootImportPlugin ]
        }
      )

      expect(transformedCode.code).to.contain('\"./../dir/test\"')
    })

    it('for a require with expression starting with prefix', () => {
      const transformedCode = transform(
        'const Test = require("~/" + "/test")', {
          filename: '/project/root/otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ rootImportPlugin ]
        }
      )

      expect(transformedCode.code).to.contain('\"./../" + "/test\"')
    })

    it('for require that starts with string and has variable', () => {
      const transformedCode = transform(
        'const Test = require("~/foo" + myVar + "/test")', {
          filename: '/project/root/otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ rootImportPlugin ]
        }
      )

      expect(transformedCode.code).to.contain('\"./../foo" + myVar + "/test\"')
    })

    it('for require with template string variable', () => {
      const transformedCode = transform(
        'const Test = require(`~/${myVar}`)', {
          filename: '/project/root/otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ rootImportPlugin ]
        }
      )

      expect(transformedCode.code).to.contain('`./../${ myVar }`')
    })
  })

  describe('should throw an error', () => {
    it('when the provided sourceDir option is not a string', () => {
      const transformCode = () => {
        transform(
          'import Test from "~/dir/test"', {
            filename: 'otherdir/test.js',
            plugins: [[ rootImportPlugin, { sourceDir: {} } ]]
          }
        )
      }

      expect(transformCode).to.throw(Error)
    })

    it('when the provided importPathPrefix option is not a string', () => {
      const transformCode = () => {
        transform(
          'import Test from "~/dir/test"', {
            filename: 'otherdir/test.js',
            plugins: [[ rootImportPlugin, { importPathPrefix: {} } ]]
          }
        )
      }

      expect(transformCode).to.throw(Error)
    })
  })
})
