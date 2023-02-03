import { HBCheckBox } from '@hasty-bazar/core'
import { ICellRendererParams } from 'ag-grid-community'

const ReasonCheck = ({ value }: ICellRendererParams) => {
  return <HBCheckBox disabled checked={value} />
}

export default ReasonCheck
