import type { QueryBuilderProps } from '@react-querybuilder/ts'
import { FC } from 'react'
import {
  QueryBuilder,
  defaultValueProcessorByRule,
  parseMongoDB,
  defaultRuleProcessorMongoDB,
} from 'react-querybuilder'
import AddGroupAction from './components/AddGroupAction'
import AddRuleAction from './components/AddRuleAction'
import CombinatorSelector from './components/CombinatorSelector'
import FieldSelector from './components/FieldSelector'
import OperatorSelector from './components/OperatorSelector'
import RemoveAction from './components/RemoveAction'
import ValueEditor from './components/ValueEditor'
import { HBQueryBuilderStyle } from './HBQueryBuilder.styles'

export type {
  ExportFormat,
  Field,
  FieldSelectorProps,
  RuleGroupType,
  ValueEditorProps,
  ValueProcessorByRule,
  RuleProcessor,
} from 'react-querybuilder'

export { defaultValueProcessorByRule, parseMongoDB, defaultRuleProcessorMongoDB }
export type HBQueryBuilderProps = Omit<
  QueryBuilderProps,
  'ref' | 'enableDragAndDrop' | 'defaultQuery'
>

const HBQueryBuilder: FC<HBQueryBuilderProps> = ({
  fields,
  query,
  onQueryChange,
  controlElements,
  ...otherProps
}) => {
  return (
    <>
      <HBQueryBuilderStyle>
        <QueryBuilder
          fields={fields}
          query={query}
          onQueryChange={onQueryChange}
          controlElements={{
            addGroupAction: AddGroupAction,
            addRuleAction: AddRuleAction,
            combinatorSelector: CombinatorSelector,
            operatorSelector: OperatorSelector,
            fieldSelector: FieldSelector,
            removeGroupAction: RemoveAction,
            removeRuleAction: RemoveAction,
            valueEditor: ValueEditor,
            ...controlElements,
          }}
          {...otherProps}
        />
      </HBQueryBuilderStyle>
    </>
  )
}

export default HBQueryBuilder
