import { formatFiles, Tree } from '@nrwl/devkit'
import { componentStoryGenerator } from '../component-story/component-story'
import { componentGenerator } from '../component/component'

interface Schema {
  componentName: string
  project: string
}

export default async function GenerateComponent(tree: Tree, schema: Schema) {
  await componentGenerator(tree, {
    name: schema.componentName,
    project: `${schema.project}`,
    export: true,
    directory: 'components',
  })
  await componentStoryGenerator(tree, {
    project: `${schema.project}`,
    componentPath: `components/${schema.componentName}/${schema.componentName}.tsx`,
  })
  await formatFiles(tree)
}
