import {
  dirname,
  join,
  relative,
  isAbsolute
} from 'path'
import slash from 'slash'

export default function () {
  return {
    visitor: {
      ImportDeclaration (path, state) {
        /*
         * config: {
         * projectRoot: babel option sourceRoot or process.cwd as fallback
         * prefix: importPathPrefix provided by the user in the plugin config
         * suffix: projectPathSuffix provided by the user in the plugin config
         * }
         */
        const config = extractConfig(state)

        // file currently visited
        const sourcePath = state.file.opts.filename

        if (sourcePath === 'unknown') {
          return
        }

        invariants(config)
        unixifyPaths(config) // works on windows too according to slash's doc

        // string in the import statement
        const importPath = path.node.source.value

        if (isImportPathPrefixed(importPath, config.prefix)) {
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
    projectRoot: state.file.opts.sourceRoot || process.cwd(),
    prefix: state.opts.importPathPrefix || '~/',
    suffix: state.opts.projectPathSuffix || ''
  }
}

function unixifyPaths (config) {
  config.projectRoot = slash(config.projectRoot)
  config.suffix = slash(config.suffix)
}

function invariants (state) {
  if (typeof state.suffix !== 'string') {
    throw new Error('The projectPathSuffix provided is not a string')
  }

  if (typeof state.prefix !== 'string') {
    throw new Error('The projectPathSuffix provided is not a string')
  }
}

function isImportPathPrefixed (targetPath, prefix) {
  return (targetPath.lastIndexOf(prefix, 0) === 0)
}

function getAbsoluteImportPath (importPath, config) {
  const importPathWithoutPrefix = importPath.substring(config.prefix.length)
  const suffixedProjectPath = join(config.projectRoot, config.suffix)
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
