import { transform } from 'babel-core'
import { expect } from 'chai'

import rootImportPlugin from '../src/plugin'

describe('Plugin', () => {
  describe('should transform the project relative path to a file relative path', () => {
    it('with a relative filename set', () => {
      const transformedCode = transform(
        'import Test from "~/dir/test"', {
          filename: 'otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ rootImportPlugin ]
        }
      )

      expect(transformedCode.code).to.contain('./../dir/test')
    })

    it('with an absolute filename set', () => {
      const transformedCode = transform(
        'import Test from "~/dir/test"', {
          filename: '/project/root/otherdir/test.js',
          sourceRoot: '/project/root/',
          plugins: [ rootImportPlugin ]
        }
      )

      expect(transformedCode.code).to.contain('./../dir/test')
    })

    it('without a sourceRoot set', () => {
      const transformedCode = transform(
        'import Test from "~/dir/test"', {
          filename: 'otherdir/test.js',
          plugins: [ rootImportPlugin ]
        }
      )

      expect(transformedCode.code).to.contain('./../dir/test')
    })
  })

  it('should ignore code without filename set', () => {
    const transformedCode = transform(
      'import Test from "~/dir/test"', {
        sourceRoot: '/project/root/',
        plugins: [ rootImportPlugin ]
      }
    )

    expect(transformedCode.code).to.contain('~/dir/test')
  })
})