import { join } from 'path'
import { expect } from 'chai'

import {
  normalizeSourceRoot, normalizeFilename,
  checkAndRemovePrefix, transformPath
} from '../src/helper'

describe('Helper', () => {
  describe('normalizeSourceRoot', () => {
    it('should append suffix to path', () => {
      const sourceRoot = normalizeSourceRoot('/project/root/path', 'src')
      expect(sourceRoot).to.be.equal('/project/root/path/src')
    })

    it('should use process.cwd() when no sourceRoot is supplied', () => {
      const sourceRoot = normalizeSourceRoot(undefined, 'src')
      const expectedPath = join(process.cwd(), 'src')

      expect(sourceRoot).to.be.equal(expectedPath)
    })
  })

  describe('normalizeFilename', () => {

  })
})