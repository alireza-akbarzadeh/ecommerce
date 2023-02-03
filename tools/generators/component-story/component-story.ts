//@ts-nocheck
import {
  convertNxGenerator,
  formatFiles,
  generateFiles,
  getProjects,
  joinPathFragments,
  normalizePath,
  Tree,
} from '@nrwl/devkit'
import { findDefaultExport, getComponentPropsInterface } from '@nrwl/react/src/utils/ast-utils'
import { findNodes } from '@nrwl/workspace/src/utilities/typescript/find-nodes'
import * as ts from 'typescript'

export function getComponentNode(sourceFile: ts.SourceFile): ts.Node | null {
  const defaultExport = findDefaultExport(sourceFile)

  if (
    !(
      defaultExport &&
      (findNodes(defaultExport, ts.SyntaxKind.JsxElement).length > 0 ||
        findNodes(defaultExport, ts.SyntaxKind.JsxSelfClosingElement).length > 0)
    )
  ) {
    return null
  }

  return defaultExport
}

export function findExportDeclarationsForJsx(
  source: ts.SourceFile,
): Array<ts.VariableDeclaration | ts.FunctionDeclaration | ts.ClassDeclaration> | null {
  const variables = findNodes(source, ts.SyntaxKind.VariableDeclaration)
  const variableStatements = findNodes(source, ts.SyntaxKind.VariableStatement)
  const fns = findNodes(source, ts.SyntaxKind.FunctionDeclaration)
  const cls = findNodes(source, ts.SyntaxKind.ClassDeclaration)

  const exportDeclarations: ts.ExportDeclaration[] = findNodes(
    source,
    ts.SyntaxKind.ExportDeclaration,
  ) as ts.ExportDeclaration[]

  let componentNamesNodes: ts.Node[] = []

  exportDeclarations.forEach((node) => {
    componentNamesNodes = [
      ...componentNamesNodes,
      ...findNodes(node, ts.SyntaxKind.ExportSpecifier),
    ]
  })

  const componentNames = componentNamesNodes?.map((node) => node.getText())

  const all = [...variables, ...variableStatements, ...fns, ...cls] as Array<
    ts.VariableDeclaration | ts.VariableStatement | ts.FunctionDeclaration | ts.ClassDeclaration
  >
  let foundExport: ts.Node[]
  let foundJSX: ts.Node[]

  const nodesContainingJSX = all.filter((x) => {
    foundJSX = findNodes(x, [ts.SyntaxKind.JsxSelfClosingElement, ts.SyntaxKind.JsxOpeningElement])
    return foundJSX?.length
  })

  const exported = nodesContainingJSX.filter((x) => {
    foundExport = findNodes(x, ts.SyntaxKind.ExportKeyword)
    if (x.kind === ts.SyntaxKind.VariableStatement) {
      const nameNode = findNodes(
        x,
        ts.SyntaxKind.VariableDeclaration,
      )?.[0] as ts.VariableDeclaration
      return (
        nameNode?.name?.kind === ts.SyntaxKind.Identifier ||
        foundExport?.length ||
        componentNames?.includes(nameNode?.name?.getText())
      )
    } else {
      return (
        (x.name.kind === ts.SyntaxKind.Identifier && foundExport?.length) ||
        componentNames?.includes(x.name.getText())
      )
    }
  })

  const exportedDeclarations: Array<
    ts.VariableDeclaration | ts.FunctionDeclaration | ts.ClassDeclaration
  > = exported.map((x) => {
    if (x.kind === ts.SyntaxKind.VariableStatement) {
      const nameNode = findNodes(
        x,
        ts.SyntaxKind.VariableDeclaration,
      )?.[0] as ts.VariableDeclaration
      return nameNode
    }
    return x
  })

  return exportedDeclarations || null
}

export interface CreateComponentStoriesFileSchema {
  project: string
  componentPath: string
}

// TODO: candidate to refactor with the angular component story
export function getArgsDefaultValue(property: ts.SyntaxKind): string {
  const typeNameToDefault: Record<number, any> = {
    [ts.SyntaxKind.StringKeyword]: "''",
    [ts.SyntaxKind.NumberKeyword]: 0,
    [ts.SyntaxKind.BooleanKeyword]: false,
  }

  const resolvedValue = typeNameToDefault[property]
  if (typeof resolvedValue === undefined) {
    return "''"
  } else {
    return resolvedValue
  }
}

export function createComponentStoriesFile(
  host: Tree,
  { project, componentPath }: CreateComponentStoriesFileSchema,
) {
  const proj = getProjects(host).get(project)
  const sourceRoot = proj.sourceRoot

  const componentFilePath = joinPathFragments(sourceRoot, componentPath)

  const componentDirectory = componentFilePath.replace(
    componentFilePath.slice(componentFilePath.lastIndexOf('/')),
    '',
  )

  const componentFileName = componentFilePath
    .slice(componentFilePath.lastIndexOf('/') + 1)
    .replace('.tsx', '')

  const name = componentFileName

  const contents = host.read(componentFilePath, 'utf-8')
  if (contents === null) {
    throw new Error(`Failed to read ${componentFilePath}`)
  }

  const sourceFile = ts.createSourceFile(componentFilePath, contents, ts.ScriptTarget.Latest, true)

  const cmpDeclaration = getComponentNode(sourceFile)

  if (!cmpDeclaration) {
    const componentNodes = findExportDeclarationsForJsx(sourceFile)
    if (componentNodes?.length) {
      componentNodes.forEach((declaration) => {
        findPropsAndGenerateFile(
          host,
          sourceFile,
          declaration,
          project,
          componentDirectory,
          name,
          componentNodes.length > 1,
        )
      })
    } else {
      throw new Error(`Could not find any React component in file ${componentFilePath}`)
    }
  } else {
    findPropsAndGenerateFile(host, sourceFile, cmpDeclaration, project, componentDirectory, name)
  }
}

export function findPropsAndGenerateFile(
  host: Tree,
  sourceFile: ts.SourceFile,
  cmpDeclaration: ts.Node,
  project: string,
  componentDirectory: string,
  name: string,
  fromNodeArray?: boolean,
) {
  const propsInterface = getComponentPropsInterface(sourceFile, cmpDeclaration)

  let propsTypeName: string = null
  let props: {
    name: string
    defaultValue: any
  }[] = []
  const argTypes: {
    name: string
    type: string
    actionText: string
  }[] = []

  if (propsInterface) {
    propsTypeName = propsInterface.name.text
    //@ts-ignore
    props = propsInterface.members.map((member: ts.PropertySignature) => {
      if (member.type.kind === ts.SyntaxKind.FunctionType) {
        argTypes.push({
          name: (member.name as ts.Identifier).text,
          type: 'action',
          actionText: `${(member.name as ts.Identifier).text} executed!`,
        })
      } else {
        return {
          name: (member.name as ts.Identifier).text,
          defaultValue: getArgsDefaultValue(member.type.kind),
        }
      }
    })
    props = props.filter((p) => p && p.defaultValue !== undefined)
  }

  generateFiles(host, joinPathFragments(__dirname, './files'), normalizePath(componentDirectory), {
    componentFileName: fromNodeArray ? `${name}--${(cmpDeclaration as any).name.text}` : name,
    componentImportFileName: name,
    propsTypeName,
    props,
    argTypes,
    componentName: (cmpDeclaration as any).name.text,
    projectName: project,
    tmpl: '',
  })
}

export async function componentStoryGenerator(
  host: Tree,
  schema: CreateComponentStoriesFileSchema,
) {
  createComponentStoriesFile(host, schema)
  await formatFiles(host)
}

export default componentStoryGenerator
export const componentStorySchematic = convertNxGenerator(componentStoryGenerator)
