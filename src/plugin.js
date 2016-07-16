import { dirname, join, relative, isAbsolute } from 'path'
import slash from 'slash'

export default function ({types: t}) {
  return {
    visitor: {
      CallExpression (path, state) {
        if (path.node.callee.name !== 'require') { return }
        const args = path.node.arguments
        if (!args.length) { return }

        const config = extractConfig(state)

        const sourcePath = state.file.opts.filename

        if (sourcePath === 'unknown') {
          return
        }

        invariants(config)

        const firstArg = traverseExpression(t, args[0])
        const importPath = firstArg.value.raw || firstArg.value
        if (isImportPathPrefixed(importPath, config.importPathPrefix)) {
          let newValue = getNewValue(config, sourcePath, importPath)
          newValue += importPath === config.importPathPrefix ? '/' : ''
          if (typeof firstArg.value === 'object') {
            firstArg.value.raw = newValue
            firstArg.value.cooked = newValue
          } else {
            firstArg.value = newValue
          }
        }
      },
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
          path.node.source.value = getNewValue(config, sourcePath, importPath)
        }
      }
    }
  }
}

function traverseExpression (t, arg) {
  if (t.isStringLiteral(arg)) {
    return arg
  }
  if (t.isBinaryExpression(arg)) {
    return traverseExpression(t, arg.left)
  }
  if (t.isTemplateLiteral(arg)) {
    return traverseExpression(t, arg.quasis[0])
  }
  if (t.isTemplateElement(arg)) {
    return arg
  }
  return null
}

function getNewValue (config, sourcePath, importPath) {
  const absoluteImportPath = getAbsoluteImportPath(importPath, config)
  const absoluteSourcePath = getAbsoluteSourcePath(config.projectRoot, sourcePath)
  const relativeImportPath = relative(dirname(absoluteSourcePath), absoluteImportPath)
  console.log(importPath, absoluteImportPath, absoluteSourcePath, relativeImportPath)
  return './' + slash(relativeImportPath)
}

function extractConfig (state) {
  return {
    projectRoot: state.file.opts.sourceRoot || process.cwd(),
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
