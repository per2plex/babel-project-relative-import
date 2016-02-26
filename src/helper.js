import slash from 'slash'
import { join, basename, dirname, relative, isAbsolute } from 'path'

export function normalizeSourceRoot(sourceRoot, suffix = '') {
  if (typeof sourceRoot !== 'string') sourceRoot = undefined
  if (typeof suffix !== 'string') suffix = ''

  if (!sourceRoot) sourceRoot = process.cwd()

  return [
    slash(sourceRoot),
    slash(join(sourceRoot, suffix))
  ]
}

export function normalizeFilename(filename, sourceRoot, suffixedSourceRoot) {
  if (typeof filename !== 'string') return null
  if (typeof sourceRoot !== 'string') return null
  if (typeof suffixedSourceRoot !== 'string') return null

  if (filename === 'unknown') return null

  let absoluteFilename = null

  // Some babel wrappers supply an absolute path already
  // so we need to check for that.
  if (isAbsolute(filename)) {
    absoluteFilename = filename
  } else {
    absoluteFilename = join(sourceRoot, filename)
  }

  return slash(relative(suffixedSourceRoot, absoluteFilename))
}

export function checkAndRemovePrefix(path, prefix) {
  if (path.startsWith(prefix)) {
    return path.substring(prefix.length)
  } else {
    return null
  }
}

export function transformPath(importPath, filePath, sourceRoot) {
  const importPathName = basename(importPath)

  const absoluteImportPath = dirname(join(sourceRoot, importPath))
  const absoluteFilePath = dirname(join(sourceRoot, filePath))
  const relativeImportPath = relative(absoluteFilePath, absoluteImportPath)

  return './' + slash(join(relativeImportPath, importPathName))
}