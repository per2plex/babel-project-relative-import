import { dirname, join, relative, isAbsolute } from 'path'
import slash from 'slash'

export default function () {
  return {
    visitor: {
      ImportDeclaration (path, state) {
        // config: {
        //   projectRoot: babel option sourceRoot or process.cwd as fallback
        //   importPathPrefix: import path prefix provided by the user in the plugin config
        //   sourceDir: source directory provided by the user in the plugin config
        // }
        const config = extractConfig(state)

        // File currently visited
        const sourcePath = state.file.opts.filename

        if (sourcePath === 'unknown') {
          return
        }

        invariants(config)

        // Path in the import statement
        const importPath = path.node.source.value

        if (isImportPathPrefixed(importPath, config.importPathPrefix)) {
          const absoluteImportPath = getAbsoluteImportPath(importPath, config)

          const absoluteSourcePath = getAbsoluteSourcePath(config.projectRoot, sourcePath)
          const relativeImportPath = relative(dirname(absoluteSourcePath), absoluteImportPath)

          path.node.source.value = './' + slash(relativeImportPath)
        }
      }
    }
  }
}

function extractConfig (state) {
  return {
    projectRoot: state.opts.projectRoot || process.cwd(),
    importPathPrefix: state.opts.importPathPrefix || '~/',
    sourceDir: state.opts.sourceDir || ''
  }
}

function invariants (state) {
  if (typeof state.sourceDir !== 'string') {
    throw new Error('The "sourceDir" provided is not a string')
  }

  if (typeof state.importPathPrefix !== 'string') {
    throw new Error('The "importPathPrefix" provided is not a string')
  }
}

function isImportPathPrefixed (targetPath, prefix) {
  return (targetPath.lastIndexOf(prefix, 0) === 0)
}

function getAbsoluteImportPath (importPath, config) {
  const importPathWithoutPrefix = importPath.substring(config.importPathPrefix.length)
  const suffixedProjectPath = join(config.projectRoot, config.sourceDir)

  return join(suffixedProjectPath, importPathWithoutPrefix)
}

function getAbsoluteSourcePath (projectRoot, sourcePath) {
  // Some babel wrappers supply an absolute path already
  // so we need to check for that.
  if (isAbsolute(sourcePath)) {
    return sourcePath
  } else {
    return join(projectRoot, sourcePath)
  }
}
