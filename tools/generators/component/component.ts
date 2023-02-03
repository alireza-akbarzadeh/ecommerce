//@ts-nocheck
import {
  applyChangesToString,
  convertNxGenerator,
  formatFiles,
  generateFiles,
  GeneratorCallback,
  getProjects,
  joinPathFragments,
  logger,
  Tree,
} from '@nrwl/devkit'
import { addImport } from '@nrwl/react/src/utils/ast-utils'
import { runTasksInSerial } from '@nrwl/workspace/src/utilities/run-tasks-in-serial'
import * as ts from 'typescript'
import { Schema } from './schema'

interface NormalizedSchema extends Schema {
  projectSourceRoot: string
  directory: string
}

export async function componentGenerator(host: Tree, schema: Schema) {
  const options = await normalizeOptions(host, schema)
  createComponentFiles(host, options)
  const tasks: GeneratorCallback[] = []
  addExportsToBarrel(host, options)
  await formatFiles(host)
  return runTasksInSerial(...tasks)
}

function createComponentFiles(host: Tree, options: NormalizedSchema) {
  const componentDir = joinPathFragments(options.projectSourceRoot, options.directory)

  generateFiles(host, joinPathFragments(__dirname, './files'), componentDir, {
    ...options,
    tmpl: '',
  })
}

function addExportsToBarrel(host: Tree, options: NormalizedSchema) {
  const workspace = getProjects(host)
  const isApp = workspace.get(options.project).projectType === 'application'

  if (options.export && !isApp) {
    const indexFilePath = joinPathFragments(options.projectSourceRoot, 'components/index.tsx')
    const indexSource = host.read(indexFilePath, 'utf-8')

    if (indexSource !== null) {
      const indexSourceFile = ts.createSourceFile(
        indexFilePath,
        indexSource,
        ts.ScriptTarget.Latest,
        true,
      )
      const changes = applyChangesToString(
        indexSource,
        addImport(indexSourceFile, `export * from './${options.name}';`),
      )
      host.write(indexFilePath, changes)
    }
  }
}

async function normalizeOptions(host: Tree, options: Schema): Promise<NormalizedSchema> {
  assertValidOptions(options)

  const project = getProjects(host).get(options.project)

  if (!project) {
    logger.error(
      `Cannot find the ${options.project} project. Please double check the project name.`,
    )
    throw new Error()
  }

  const { sourceRoot: projectSourceRoot, projectType } = project

  const directory = await getDirectory(host, options)

  if (options.export && projectType === 'application') {
    logger.warn(`The "--export" option should not be used with applications and will do nothing.`)
  }

  return {
    ...options,
    directory,
    projectSourceRoot,
  }
}

async function getDirectory(host: Tree, options: Schema) {
  const workspace = getProjects(host)
  let baseDir: string
  if (options.directory) {
    baseDir = options.directory
  } else {
    baseDir = workspace.get(options.project).projectType === 'application' ? 'app' : 'lib'
  }
  return joinPathFragments(baseDir, options.name)
}

function assertValidOptions(options: Schema) {
  const slashes = ['/', '\\']
  slashes.forEach((s) => {
    if (options.name.indexOf(s) !== -1) {
      const [name, ...rest] = options.name.split(s).reverse()
      let suggestion = rest.map((x) => x.toLowerCase()).join(s)
      if (options.directory) {
        suggestion = `${options.directory}${s}${suggestion}`
      }
      throw new Error(
        `Found "${s}" in the component name. Did you mean to use the --directory option (e.g. \`nx g c ${name} --directory ${suggestion}\`)?`,
      )
    }
  })
}

export default componentGenerator

export const componentSchematic = convertNxGenerator(componentGenerator)
