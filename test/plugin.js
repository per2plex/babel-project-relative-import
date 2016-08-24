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

      expect(transformedCode.code).to.contain('"~/dir/test"')
    })

    it('when import path is not prefixed', () => {
      const transformedCode = transform(
        'import Test from "~/dir/test"', {
          filename: 'otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ [ rootImportPlugin, { importPathPrefix: '^' } ] ]
        }
      )

      expect(transformedCode.code).to.contain('"~/dir/test"')
    })
  })

  describe('should transform the project relative path to a file relative path', () => {
    it('with a custom sourceDir', () => {
      const transformedCode = transform(
        'import Test from "~/dir/test"', {
          filename: 'src/otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ [ rootImportPlugin, { sourceDir: 'src/' } ] ]
        }
      )

      expect(transformedCode.code).to.contain('"./../dir/test"')
    })

    it('with a custom importPathPrefix', () => {
      const transformedCode = transform(
        'import Test from "^dir/test"', {
          filename: 'otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ [ rootImportPlugin, { importPathPrefix: '^' } ] ]
        }
      )

      expect(transformedCode.code).to.contain('"./../dir/test"')
    })

    it('with a relative filename set', () => {
      const transformedCode = transform(
        'import Test from "~/dir/test"', {
          filename: 'otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ rootImportPlugin ]
        }
      )

      expect(transformedCode.code).to.contain('"./../dir/test"')
    })

    it('with an absolute filename set', () => {
      const transformedCode = transform(
        'import Test from "~/dir/test"', {
          filename: '/project/root/otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ rootImportPlugin ]
        }
      )

      expect(transformedCode.code).to.contain('"./../dir/test"')
    })

    it('without a sourceRoot set', () => {
      const transformedCode = transform(
        'import Test from "~/dir/test"', {
          filename: 'otherdir/test.js',
          plugins: [ rootImportPlugin ]
        }
      )

      expect(transformedCode.code).to.contain('"./../dir/test"')
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
