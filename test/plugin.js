/* global describe, it */

import { transform } from 'babel-core'
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
  })

  describe('should transform the project relative path to a file relative path', () => {
    it('with a custom suffix', () => {
      const transformedCode = transform(
        'import Test from "~/dir/test"', {
          filename: 'otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ [ rootImportPlugin, { projectPathSuffix: '/bla' } ] ]
        }
      )

      expect(transformedCode.code).to.contain('\"./../bla/dir/test\"')
    })

    it('with a custom prefix', () => {
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
  })

  describe('should throw an error', () => {
    it('when the provided suffix option is not a string', () => {
      const transformCode = () => {
        transform(
          'import Test from "~/dir/test"', {
            filename: 'otherdir/test.js',
            plugins: [[ rootImportPlugin, { projectPathSuffix: {} } ]]
          }
        )
      }

      expect(transformCode).to.throw(Error)
    })

    it('when the provided prefix option is not a string', () => {
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
