import type { ExportFormat, RuleGroupTypeAny, RuleProcessor } from 'react-querybuilder'
import { formatQuery } from 'react-querybuilder'

const getFormatQuery = (
  query: RuleGroupTypeAny,
  exportFormat: Exclude<ExportFormat, 'parameterized' | 'parameterized_named' | 'jsonlogic'>,
  ruleProcessor?: RuleProcessor,
): string => {
  return formatQuery(query, {
    format: exportFormat,
    parseNumbers: true,
    ruleProcessor,
  })
}

export default getFormatQuery
