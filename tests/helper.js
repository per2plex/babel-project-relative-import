import { join } from 'path'
import { expect } from 'chai'

import {
  normalizeSourceRoot, normalizeFilename,
  checkAndRemovePrefix, transformPath
} from '../src/helper'

describe('Helper', () => {
  describe('normalizeSourceRoot', () => {
    it('should append suffix to path', () => {
      const sourceRoot = '/project/root/path'
      const suffix = 'src'

      expect(normalizeSourceRoot(sourceRoot, suffix))
        .to.be.equal('/project/root/path/src')
    })

    it('should use process.cwd() when sourceRoot is a non-string', () => {
      const expectedPath = join(process.cwd(), 'src')

      expect(normalizeSourceRoot(undefined, 'src')).to.be.equal(expectedPath)
      expect(normalizeSourceRoot({}, 'src')).to.be.equal(expectedPath)
    })
  })

  describe('normalizeFilename', () => {
    it('should return input if filename is relative', () => {
      const sourceRoot = '/project/root/path'
      const filename = 'dir/subdir/test.js'

      expect(normalizeFilename(filename, sourceRoot)).to.be.equal(filename)
    })

    it('should return a relative filename if input is absolute', () => {
      const sourceRoot = '/project/root/path'
      const filename = '/project/root/path/dir/subdir/test.js'

      expect(normalizeFilename(filename, sourceRoot))
        .to.be.equal('dir/subdir/test.js')
    })

    it('should return null if filename is "unknown"', () => {
      const sourceRoot = '/project/root/path'
      const filename = 'unknown'

      expect(normalizeFilename(filename, sourceRoot)).to.be.null
    })

    it('should return null if filename or sourceRoot are non-strings', () => {
      const sourceRoot = {}
      const filename = 1

      expect(normalizeFilename(filename, '/')).to.be.null
      expect(normalizeFilename('/', sourceRoot)).to.be.null
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