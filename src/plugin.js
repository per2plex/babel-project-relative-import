import {
  normalizeSourceRoot, normalizeFilename,
  checkAndRemovePrefix, transformPath
} from './helper'

export default function() {
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const projectPathSuffix = typeof state.opts.projectPathSuffix == 'string' ?
          state.opts.projectPathSuffix :
          ''

        const importPathPrefix = typeof state.opts.importPathPrefix == 'string' ?
          state.opts.importPathPrefix + '/':
          '~/'

        const sourceRoot = normalizeSourceRoot(
          state.file.opts.sourceRoot, projectPathSuffix
        )

        // Tried to use filenameRelative but it doesn't seem to be set correctly
        // by any major wrapper for babel.
        const filename = normalizeFilename(
          state.file.opts.filename,
          sourceRoot
        )

        if (!filename) return

        const importPath = path.node.source.value
        const importPathWithoutPrefix = checkAndRemovePrefix(
          importPath, importPathPrefix
        )

        if (importPathWithoutPrefix) {
          path.node.source.value = transformPath(
            importPathWithoutPrefix, filename, sourceRoot
          )
        }
      }
    }
  }
}