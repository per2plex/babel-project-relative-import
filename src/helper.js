import { join, basename, dirname, relative, isAbsolute } from 'path'

export function normalizeSourceRoot(sourceRoot, suffix = '') {
  if (typeof sourceRoot != 'string') sourceRoot = undefined
  if (typeof suffix != 'string') suffix = ''

  if (!sourceRoot) sourceRoot = process.cwd()

  return join(sourceRoot, suffix)
}

export function normalizeFilename(filename, sourceRoot) {
  if (typeof filename != 'string') return null
  if (typeof sourceRoot != 'string') return null
  if (filename == 'unknown') return null

  // babel-loader supplies an absolute path as filename
  // so we need to check for that.
  if (isAbsolute(filename)) {
    return relative(sourceRoot, filename)
  }

  return filename
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

  return './' + join(relativeImportPath, importPathName)
}