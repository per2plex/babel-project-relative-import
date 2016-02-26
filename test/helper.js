import slash from 'slash'

import { join } from 'path'
import { expect } from 'chai'

import {
  normalizeSourceRoot, normalizeFilename,
  checkAndRemovePrefix, transformPath
} from '../src/helper'

describe('Helper', () => {
  describe('normalizeSourceRoot', () => {
    it('should return suffixed and non-suffixed sourceRoot', () => {
      const inputSourceRoot = '/project/root/path'
      const suffix = 'src'

      {
        const [sourceRoot, suffixedSourceRoot] =
          normalizeSourceRoot(inputSourceRoot, suffix)

        expect(sourceRoot).to.be.equal('/project/root/path')
        expect(suffixedSourceRoot).to.be.equal('/project/root/path/src')
      }

      {
        const [sourceRoot, suffixedSourceRoot] =
          normalizeSourceRoot(inputSourceRoot)

        expect(sourceRoot).to.be.equal('/project/root/path')
        expect(suffixedSourceRoot).to.be.equal('/project/root/path')
      }
    })

    it('should use process.cwd() when sourceRoot is a non-string', () => {
      const expectedSourceRoot = slash(process.cwd())
      const expectedSuffixedSourceRoot = slash(join(expectedSourceRoot, 'src'))

      {
        const [sourceRoot, suffixSourceRoot] =
          normalizeSourceRoot(undefined, 'src')

        expect(sourceRoot).to.be.equal(expectedSourceRoot)
        expect(suffixSourceRoot).to.be.equal(expectedSuffixedSourceRoot)
      }

      {
        const [sourceRoot, suffixSourceRoot] =
          normalizeSourceRoot({}, 'src')

        expect(sourceRoot).to.be.equal(expectedSourceRoot)
        expect(suffixSourceRoot).to.be.equal(expectedSuffixedSourceRoot)
      }
    })
  })

  describe('normalizeFilename', () => {
    it('should return filename relative to suffixedSourceRoot', () => {
      const sourceRoot = '/project/root/path'
      const suffixedSourceRoot = '/project/root/path/src'
      const filename = 'src/dir/subdir/test.js'

      expect(
        normalizeFilename(filename, sourceRoot, suffixedSourceRoot)
      ).to.be.equal('dir/subdir/test.js')
    })

    it('should return filename relative to suffixedSourceRoot if input is absolute', () => {
      const sourceRoot = '/project/root/path'
      const suffixedSourceRoot = '/project/root/path/src'
      const filename = '/project/root/path/src/dir/subdir/test.js'

      expect(normalizeFilename(filename, sourceRoot, suffixedSourceRoot))
        .to.be.equal('dir/subdir/test.js')
    })

    it('should return null if filename is "unknown"', () => {
      const sourceRoot = '/project/root/path'
      const suffixedSourceRoot = '/project/root/path/src'
      const filename = 'unknown'

      expect(normalizeFilename(filename, sourceRoot, suffixedSourceRoot)).to.be.null
    })

    it('should return null if filename, sourceRoot or suffixedSourceRoot are non-strings', () => {
      expect(normalizeFilename(1, '/', '/')).to.be.null
      expect(normalizeFilename('/', {}, '/')).to.be.null
      expect(normalizeFilename('/', '/', undefined)).to.be.null
    })
  })

  describe('checkAndRemovePrefix', () => {
    it('should return path with prefix removed', () => {
      const prefix = '~prefix/'
      const path = '~prefix/dir/subdir/test.js'

      expect(checkAndRemovePrefix(path, prefix))
        .to.be.equal('dir/subdir/test.js')
    })

    it('should return null if prefix doesn\'t match', () => {
      const prefix = '~prefix/'
      const path = '/dir/subdir/test.js'

      expect(checkAndRemovePrefix(path, prefix)).to.be.null
    })
  })

  describe('transformPath', () => {
    it('should return relative path for supplied paths', () => {
      const importPath = 'dir/subdir/test.js'
      const filePath = 'otherdir/subdir/test.js'
      const sourceRoot = '/project/root/'

      expect(transformPath(importPath, filePath, sourceRoot))
        .to.be.equal('./../../dir/subdir/test.js')
    })
  })
})