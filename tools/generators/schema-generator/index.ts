import { generateFiles, getProjects, joinPathFragments, Tree, writeJsonFile } from '@nrwl/devkit'
import { spawnSync } from 'child_process'
import fetch from 'node-fetch'
import { Schema } from 'nx/src/utils/params'
import pino from 'pino'

const logger = pino({
  name: 'CodeGenerator',
  enabled: process.env.CODEGEN_DEBUG === 'true',
  transport: {
    target: 'pino-pretty',
  },
})

// The following allows running the codegen with a baseURL argument
// e.g. pnpm admin-codegen baseURL=https://admingateway-develop.hasti.co
let baseURL = ''
const baseURLArg = process.argv.filter((arg) => /^baseURL=/.test(arg))

if (baseURLArg.length === 1) {
  baseURL = baseURLArg[0].split('=')[1]
  logger.info('Read baseURL from args')
} else {
  baseURL = process.env.NEXT_PUBLIC_GATEWAY as string
  logger.info('Read baseURL from env')
}

// const isWindows = process.platform === 'win32'
interface CodeGeneratorSchema extends Schema {
  project: string
}
type Definition = {
  name: string
  // url: string
}

export default async function (host: Tree, options: CodeGeneratorSchema) {
  logger.info(`${baseURL}/definitions`)
  const definitions: Definition[] = await fetch(`${baseURL}/definitions`)
    .then((res) => {
      logger.info(res)
      return res.json()
    })
    .catch((err) => {
      logger.error(err)
      return []
    })
    .finally(() => {
      logger.info('[Fetch-Definitions][Success]')
      return []
    })

  const projectConfiguration = getProjects(host).get(options.project)
  const projectSourceRoot = projectConfiguration?.sourceRoot ?? ''

  let servicesDir = joinPathFragments(projectSourceRoot, 'src', 'services')
  const endPoints = definitions.map((item) => item.name)
  let componentDir = joinPathFragments(projectSourceRoot, 'src', 'core', 'redux', 'baseConfigs')

  if (['apps/admin', 'apps/vendor'].includes(projectSourceRoot)) {
    servicesDir = joinPathFragments('libs', 'admin-shared', 'src', 'services')
    componentDir = joinPathFragments('libs', 'admin-shared', 'src', 'core', 'redux', 'baseConfigs')
  }

  generateFiles(host, joinPathFragments(__dirname, './index'), servicesDir, {
    endPoints,
    tmpl: '',
  })
  endPoints.forEach((endpoint) =>
    generateFiles(host, joinPathFragments(__dirname, './files'), componentDir, {
      endpoint,
      project: `${options.project}`,
      tmpl: '',
    }),
  )

  const schemaCreator = async (endpoint: Definition) => {
    const schema = await fetch(`${baseURL}/swagger/docs/v1/${endpoint.name}`)
      .then((res) => {
        logger.info(`[Fetch-Schema][${endpoint.name}][Success]`)
        return res.arrayBuffer().then(Buffer.from)
      })
      .catch((err) => {
        logger.error(`[Fetch-Schema][${endpoint.name}][Error]`, err)
        return err
      })

    const schemaFile = `${componentDir}/${endpoint.name}Schema.json`
    writeJsonFile(schemaFile, JSON.parse(schema.toString()))
  }

  definitions.forEach(async (endpoint) => {
    try {
      await schemaCreator(endpoint).then(async () => {
        setTimeout(() => {
          const apiPath = joinPathFragments(componentDir, `${endpoint.name}BaseConfig.ts`)
          const child = spawnSync(
            'node ./node_modules/@rtk-query/codegen-openapi/lib/bin/cli.js',
            [apiPath],
            {
              stdio: 'inherit',
              shell: true, // Windows fix "Error: spawn npx ENOENT"
              timeout: 200000,
              maxBuffer: 99999999999999,
              encoding: 'utf-8',
            },
          )
          if (child.error) {
            logger.error(child.error)
          }
        }, 20000)
      })
    } catch (error) {
      logger.error(`[Service-Creator][${endpoint.name}][Error]`, error)
    }
  })
}
