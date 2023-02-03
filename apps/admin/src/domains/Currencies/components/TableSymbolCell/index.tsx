import { HBIcon, HBIconType } from '@hasty-bazar/core'
import { ParamsValueType } from '../../types/types'

const TableSymbolCell = ({ value }: ParamsValueType) => (
  <HBIcon type={value as HBIconType} size="small" />
)

export default TableSymbolCell
